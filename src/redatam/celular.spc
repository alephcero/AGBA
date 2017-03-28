RUNDEF Job
    SELECTION ALL
       UNIVERSE VIVIENDA.AGLO = 1 AND VIVIENDA.V01 < 7 AND  VIVIENDA.V02 = 1 

//1 SI 2 NO

TABLE TABLE1
        TITLE "Lista por Áreas de : HOGAR.H2819C"
        AS AREALIST
        OF RADIO, HOGAR.H2819C 10.0 H2819C
        OUTPUTFILE DBF "C:\Users\pipe\Documents\AGBA\data\redatam\CELULAR.dbf"
        OVERWRITE