RUNDEF Job
    SELECTION ALL
    //aglomerado 1 vivienda particular ocupada 
    UNIVERSE VIVIENDA.AGLO = 1 AND VIVIENDA.V01 < 7 //AND  VIVIENDA.V02 = 1
    
//1 habilitada con personas presentes
//2 habilitada con todas las personas tempo ausentes
//3 desahibiliata en alquiler o venta
//4 deshabilitada en construccion
//5 deshabilitada se usa como coercio oficina
//6 Deshabilitada 

TABLE TABLE1
        TITLE "Lista por Áreas de : VIVIENDA.V02"
        AS AREALIST
        OF RADIO, VIVIENDA.V02 10.0 V02
        OUTPUTFILE DBF "C:\Users\pipe\Documents\AGBA\data\redatam\EMPTY.dbf"
        OVERWRITE