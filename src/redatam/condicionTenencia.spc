RUNDEF Job
    SELECTION ALL
       UNIVERSE VIVIENDA.AGLO = 1 AND VIVIENDA.V01 < 7 AND  VIVIENDA.V02 = 1 
/*
1 Propietario de la vivienda y del terreno	
2 Propietario s�lo de la vivienda	
3 Inquilino	
4 Ocupante por pr�stamo	
5 Ocupante por trabajo	
6 Otra situaci�n	
T Total
*/

TABLE TABLE1
        TITLE "Lista por �reas de : HOGAR.PROP"
        AS AREALIST
        OF RADIO, HOGAR.PROP 10.0 PROP
        OUTPUTFILE DBF "C:\Users\pipe\Documents\AGBA\data\redatam\LEGAL.dbf"
        OVERWRITE