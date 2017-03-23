
import pandas as pd
import pysal as ps
'''
Arguments
---------
dbfile  : DBF file - Input to be imported
upper   : Condition - If true, make column heads upper case
'''
def dbf2DF(dbfile, upper=True): #Reads in DBF files and returns Pandas DF
    db = ps.open(dbfile) #Pysal to open DBF
    d = {col: db.by_col(col) for col in db.header} #Convert dbf to dictionary
    pandasDF = pd.DataFrame(db[:]) #Convert to Pandas DF
    pandasDF.columns=db.header
    pandasDF.dropna(inplace=True)
    return pandasDF
