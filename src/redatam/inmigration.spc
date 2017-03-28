RUNDEF Job
    SELECTION ALL
    UNIVERSE VIVIENDA.AGLO = 1 AND  PERSONA.P01 = 1

//1 argentina 2 otro pais

TABLE TABLE1
        TITLE "Lista por Áreas de : PERSONA.P05"
        AS AREALIST
        OF RADIO, PERSONA.P05 10.0 P05
        OUTPUTFILE DBF "C:\Users\pipe\Documents\AGBA\data\redatam\INMIGRATION.dbf"
        OVERWRITE