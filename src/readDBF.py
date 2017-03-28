import pandas as pd
import pysal as ps
import numpy as np

def dbf2DF(dbfile, upper=True): #Reads in DBF files and returns Pandas DF
    '''
    Arguments
    ---------
    dbfile  : DBF file - Input to be imported
    upper   : Condition - If true, make column heads upper case
    '''
    db = ps.open(dbfile) #Pysal to open DBF
    d = {col: db.by_col(col) for col in db.header} #Convert dbf to dictionary
    pandasDF = pd.DataFrame(db[:]) #Convert to Pandas DF
    pandasDF.columns=db.header
    pandasDF.dropna(inplace=True)
    return pandasDF

def getPercent(dataset,string):
    '''
    Arguments
    ---------
    dataset  : pandas datafra- Input to produce the % column on
    string   : String or list of strings - variable or variables to convert to %
    '''
    mask = (dataset.iloc[:,dataset.shape[1]-1] == 0)
    dataset = dataset.loc[~mask,:]
    variable = np.zeros(dataset.shape[0])
    
    #if me need to aggregate more columns in the same category:
    if len(string) > 1:
        variable = dataset.loc[:,string].sum(axis=1)
        
    else:
        variable = dataset[string].iloc[:,0]
    
    newVariableName = string[0].split('_')[0]
    
    dataset[newVariableName + '_p'] = variable/dataset.iloc[:,dataset.shape[1]-1] * 100
    dataset[newVariableName + '_p'] = dataset[newVariableName + '_p'].map(lambda x: round(x,1))
    dataset = dataset.loc[:,['REDCODE',newVariableName + '_p']]
    dataset.dropna(inplace=True)
    try:
        dataset[newVariableName + '_q'] = pd.qcut(dataset[newVariableName + '_p'], 10,labels=False)
        dataset[newVariableName + '_q'] = dataset[newVariableName + '_q'].map(lambda x: int(x))
        return dataset
    except ValueError:
        print 'Can not be cut in 10 quantiles'