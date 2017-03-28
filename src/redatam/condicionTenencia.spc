RUNDEF Job
    SELECTION ALL
       UNIVERSE VIVIENDA.AGLO = 1 AND VIVIENDA.V01 < 7 AND  VIVIENDA.V02 = 1 
/*
1 Propietario de la vivienda y del terreno	
2 Propietario sólo de la vivienda	
3 Inquilino	
4 Ocupante por préstamo	
5 Ocupante por trabajo	
6 Otra situación	
T Total
*/

TABLE TABLE1
        TITLE "Lista por Áreas de : HOGAR.PROP"
        AS AREALIST
        OF RADIO, HOGAR.PROP 10.0 PROP
        OUTPUTFILE DBF "C:\Users\pipe\Documents\AGBA\data\redatam\LEGAL.dbf"
        OVERWRITE