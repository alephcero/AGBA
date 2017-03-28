RUNDEF Job
   SELECTION ALL
   UNIVERSE VIVIENDA.AGLO = 1  AND VIVIENDA.V01 < 7 AND  VIVIENDA.V02 = 1  AND  PERSONA.P01 = 1

/* 
1 Inicial	
2 Primario completo	
3 Primario Incompleto	
4 Secundario completo	
5 Secundario incompleto	
6 Superior no universitario completo	
7 Superior no universitario incompleto	
8 Universtiario completo	
9 Universitario incompleto	
T Total
*/
TABLE TABLE1
        TITLE "Lista por Áreas de : PERSONA.MNI"
        AS AREALIST
        OF RADIO, PERSONA.MNI 10.0 MNI
        OUTPUTFILE DBF "C:\Users\pipe\Documents\AGBA\data\redatam\MNI.dbf"
        OVERWRITE
        
