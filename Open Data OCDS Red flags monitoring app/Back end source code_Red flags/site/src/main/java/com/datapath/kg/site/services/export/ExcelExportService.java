package com.datapath.kg.site.services.export;

import com.datapath.kg.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.kg.elasticsearchintegration.services.ProcedureFilterService;
import com.datapath.kg.site.services.MappingResourceService;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static com.datapath.kg.site.util.Constants.*;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.joining;
import static org.springframework.util.StringUtils.isEmpty;

@Slf4j
@Component
public class ExcelExportService implements ExportService {

    private final ProcedureFilterService filterService;
    private final MappingResourceService mappingService;

    private static final String datePattern = "yyyy-MM-dd";
    private static final SimpleDateFormat format = new SimpleDateFormat(datePattern);
    private static final String sheetName = "tenders";
    private static final String linkTemplate = "http://zakupki.gov.kg/popp/view/order/view.xhtml?id=%s";
    private static final DecimalFormat df = new DecimalFormat("#,###.00");

    private static List<String> exportFields;
    private static Map<String, Object> exportFieldTypeMappings;

    static {
        exportFieldTypeMappings = new HashMap<>();
        exportFields = new LinkedList<>();

        exportFieldTypeMappings.put(TENDER_ID_FIELD_NAME, String.class);
        exportFields.add(TENDER_ID_FIELD_NAME);

        exportFieldTypeMappings.put(TENDER_AMOUNT_FIELD_NAME, Double.class);
        exportFields.add(TENDER_AMOUNT_FIELD_NAME);

        exportFieldTypeMappings.put(TENDER_METHOD_FIELD_NAME, String.class);
        exportFields.add(TENDER_METHOD_FIELD_NAME);

        exportFieldTypeMappings.put(BUYER_NAME_FIELD_NAME, String.class);
        exportFields.add(BUYER_NAME_FIELD_NAME);

        exportFieldTypeMappings.put(BUYER_ID_FIELD_NAME, String.class);
        exportFields.add(BUYER_ID_FIELD_NAME);

        exportFieldTypeMappings.put(CPV_FIELD_NAME, List.class);
        exportFields.add(CPV_FIELD_NAME);

        exportFieldTypeMappings.put(TENDER_STATUS_FIELD_NAME, String.class);
        exportFields.add(TENDER_STATUS_FIELD_NAME);

        exportFieldTypeMappings.put(BUYER_REGION_FIELD_NAME, String.class);
        exportFields.add(BUYER_REGION_FIELD_NAME);

        exportFieldTypeMappings.put(TENDER_DATE_PUBLISHED_FIELD_NAME, String.class);
        exportFields.add(TENDER_DATE_PUBLISHED_FIELD_NAME);

        exportFieldTypeMappings.put(RISKED_INDICATORS_FIELD_NAME, List.class);
        exportFields.add(RISKED_INDICATORS_FIELD_NAME);

        exportFieldTypeMappings.put(RISK_LEVEL_FIELD_NAME, Integer.class);
        exportFields.add(RISK_LEVEL_FIELD_NAME);

        exportFieldTypeMappings.put(HAS_COMPLAINTS_FIELD_NAME, Boolean.class);
        exportFields.add(HAS_COMPLAINTS_FIELD_NAME);

        exportFields.add(LINK_FIELD_NAME);
    }

    @Autowired
    public ExcelExportService(ProcedureFilterService filterService,
                              MappingResourceService mappingService) {
        this.filterService = filterService;
        this.mappingService = mappingService;
    }

    @Override
    public byte[] export(List<String> tenderIds, String localeKey) {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        XSSFWorkbook wb = new XSSFWorkbook();
        writeHeaders(wb, localeKey);
        List<TenderIndicatorsCommonInfo> forExport = new ArrayList<>();
        int count = 0;
        do {
            forExport.addAll(filterService.getByTenderIds(tenderIds.stream().skip(count).limit(1000).collect(Collectors.toList())));
            count = count + 1000;
        } while (count < tenderIds.size());
        writeData(wb, forExport, localeKey);
        try {
            wb.write(bos);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
        return bos.toByteArray();
    }


    private void writeHeaders(XSSFWorkbook wb, String localeKey) {
        XSSFSheet sheet = wb.createSheet(sheetName);
        XSSFRow row = sheet.createRow(0);
        int cellNumber = 0;

        for (String column : exportFields) {
            row.createCell(cellNumber++).setCellValue(
                    mappingService.getTranslatedHeader(HEADER_NAME_PREFIX + column, localeKey)
            );
        }
    }

    private String getValueByFieldName(TenderIndicatorsCommonInfo info, String fieldName, Class fieldClassName, String localeKey) {

        Class<TenderIndicatorsCommonInfo> className = TenderIndicatorsCommonInfo.class;
        try {
            Field field = className.getField(fieldName);
            if (fieldClassName == String.class) {
                return processStringType(field, fieldName, info, localeKey);
            }
            if (fieldClassName == Boolean.class) {
                return processBooleanType(field, fieldName, info, localeKey);
            }
            if (fieldClassName == Double.class) {
                return df.format(field.get(info));
            }
            if (fieldClassName == Integer.class) {
                return processIntegerType(field, fieldName, info, localeKey);
            }
            if (fieldClassName == List.class) {
                return processListType(field, fieldName, info, localeKey);
            }
        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.error(e.getMessage(), e);
        } catch (NullPointerException e) {
            log.warn("Field '{}' is null in tender '{}'", fieldName, info.getTenderId());
        }
        return null;

    }

    private void writeData(XSSFWorkbook wb, List<TenderIndicatorsCommonInfo> tenders, String localeKey) {
        XSSFSheet sheet = wb.getSheet(sheetName);

        for (TenderIndicatorsCommonInfo tender : tenders) {
            XSSFRow row = sheet.createRow(tenders.indexOf(tender) + 1);
            int cellNumber = 0;
            for (String column : exportFields) {

                String stringExportValue;

                if (LINK_FIELD_NAME.equals(column)) {
                    if (tender.getTenderId().startsWith(CONTRACT_PROCEDURE_ID_START)) {
                        stringExportValue = CONTRACT_PROCEDURE_PORTAL_LINK;
                    } else {
                        stringExportValue = String.format(linkTemplate, tender.getTenderOuterId());
                    }
                } else {
                    stringExportValue = getValueByFieldName(
                            tender,
                            column,
                            (Class) exportFieldTypeMappings.get(column),
                            localeKey
                    );
                }

                if (TENDER_DATE_PUBLISHED_FIELD_NAME.equals(column)) {
                    processDateCell(wb, row, cellNumber, stringExportValue);
                    cellNumber++;
                } else {
                    row.createCell(cellNumber++).setCellValue(castToCellValue(stringExportValue));
                }
            }
        }
    }

    private void processDateCell(XSSFWorkbook wb, XSSFRow row, int cellNumber, String stringExportValue) {
        try {
            CellStyle cellStyle = wb.createCellStyle();
            CreationHelper createHelper = wb.getCreationHelper();
            short dateFormat = createHelper.createDataFormat().getFormat(datePattern);
            cellStyle.setDataFormat(dateFormat);
            XSSFCell cell = row.createCell(cellNumber);
            cell.setCellValue(castToDateCellValue(stringExportValue));
            cell.setCellStyle(cellStyle);
        } catch (ParseException e) {
            log.error(e.getMessage(), e);
        }
    }

    private String castToCellValue(String value) {
        return isNull(value) ? "" : value;
    }

    private Date castToDateCellValue(String value) throws ParseException {
        return isNull(value) ? new Date() : format.parse(value);
    }

    private List<String> mapIndicatorsName(Collection<Integer> list) {
        return list.stream()
                .map(mappingService::getRiskIndicatorName)
                .collect(Collectors.toList());
    }

    private String processStringType(Field field, String fieldName, TenderIndicatorsCommonInfo info, String localeKey) throws IllegalAccessException {
        String value = String.valueOf(field.get(info));

        if (TENDER_STATUS_FIELD_NAME.equals(fieldName))
            return mappingService.getTranslatedMapping(TENDER_STATUS_PREFIX + value, localeKey);
        if (TENDER_METHOD_FIELD_NAME.equals(fieldName))
            return mappingService.getTranslatedMapping(TENDER_METHOD_PREFIX + value, localeKey);
        if (BUYER_REGION_FIELD_NAME.equals(fieldName)) {
            String regionKey = mappingService.getRegionKey(value);
            return mappingService.getTranslatedMapping(regionKey, localeKey);
        }
        return value;
    }

    private String processBooleanType(Field field, String fieldName, TenderIndicatorsCommonInfo info, String localeKey) throws IllegalAccessException {
        if (HAS_COMPLAINTS_FIELD_NAME.equals(fieldName))
            return mappingService.getTranslatedMapping(HAS_COMPLAINT_PREFIX + field.get(info), localeKey);

        return String.valueOf(field.getBoolean(info));
    }

    private String processIntegerType(Field field, String fieldName, TenderIndicatorsCommonInfo info, String localeKey) throws IllegalAccessException {
        if (RISK_LEVEL_FIELD_NAME.equals(fieldName))
            return mappingService.getTranslatedMapping(TENDER_RISK_LEVEL_PREFIX + field.get(info), localeKey);

        return String.valueOf(field.get(info));
    }

    private String processListType(Field field, String fieldName, TenderIndicatorsCommonInfo info, String localeKey) throws IllegalAccessException {
        Object data = field.get(info);
        if (nonNull(field.get(info))) {
            if (RISKED_INDICATORS_FIELD_NAME.equals(fieldName)) {
                Set<Integer> list = (Set<Integer>) data;
                return String.join(", ", mapIndicatorsName(list));
            } else if (CPV_FIELD_NAME.equals(fieldName)) {
                Set<String> list = (Set<String>) data;
                return list.stream()
                        .map(cpv -> {
                            String description = mappingService.getCpvName(cpv, localeKey);
                            return isEmpty(description) ? cpv : String.join(" ", cpv, description);
                        })
                        .collect(joining("; "));
            } else {
                Set<String> list = (Set<String>) data;
                return String.join(",", list);
            }
        }
        return "";
    }
}
