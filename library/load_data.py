
import pandas as pd

NOMS_FAMILIES = [
    'Arròs, pasta, sucre i llegums',
    'Begudes i infusions',
    'Carn, peix i embotits',
    'Conserves i plats preparats',
    'Farines i derivats',
    'Fruites i verdures fresques',
    'Làctics i derivats',
    'Olis i greixos'
]

NOMS_COMARQUES = [
    'Anoia',
    'Bages',
    'Baix Llobregat',
    'Barcelonès',
    'Berguedà',
    'Garraf',
    'Maresme',
    'Moianès',
    'Osona',
    'Vallès Occidental',
    'Vallès Oriental'
 ]

def load_poblacio(path, stack=False):
    df_poblacio = pd.read_csv(path + "poblacio.csv",index_col="NomComarca")

    if stack: # convert column years as single column
        df_poblacio = pd.DataFrame(df_poblacio.stack()).reset_index()
        df_poblacio.columns=["NomComarca","Any","Poblacio"]
        df_poblacio["Any"] = df_poblacio["Any"].astype(int)
        df_poblacio["Poblacio"] = df_poblacio["Poblacio"].astype(int)

    return df_poblacio

def load_df(path):

    df_food = pd.read_pickle(path + 'foodpandas.pkl')
    df_food["Any"] = df_food["Any"].dt.year.astype(int)

    df_comarques = df_food[["IDComarca","NomComarca"]].drop_duplicates().copy()

    df_food_com = df_food.groupby(
        ["NomComarca","Any","NomMacrofamilia"],
        as_index = False
    ).sum()
    df_food_com = pd.merge(
        df_food_com,
        df_comarques,
        on=["NomComarca"],
        how='left'
    )
    assert df_food_com.shape[0] == (len(list(df_food.NomComarca.unique())) * len(list(df_food.NomMacrofamilia.unique())) * len(list(df_food.Any.unique())))

    df_poblacio = load_poblacio(path, stack=True)
    df_food_com_pob = pd.merge(
        df_food_com,
        df_poblacio,
        on=["NomComarca","Any"],
        how='left'
    )
    df_food_com_pob["Quantitat_norm"] = df_food_com_pob["Quantitat"] * 1000 / df_food_com_pob["Poblacio"]
    #df_food_com_pob.drop("Poblacio", axis=1, inplace=True)

    return df_food_com_pob




    #df_food.sort_values(
    #    by = ["IDComarca","IDMrunicipi","Any"],
    #    ascending = [True,True,True],
    #    inplace = True
    #)

    #last_year = df_food["Any"].max()
    #df_food_ly = df_food[df_food["Any"] == last_year]

def load_beneficiaris_comarca(path):

  food_df = pd.read_csv(path+'foodpandas.csv',sep = ',')
  beneficiaris_df = pd.read_csv(path+'beneficiaris.csv',sep = ',')

  beneficiaris_df.loc[beneficiaris_df.NomComarca == 'maresme','NomComarca'] = 'Maresme'

  food_comarca_any_df = food_df[['NomComarca','Any','Quantitat']].groupby(['NomComarca','Any']).sum()

  beneficiaris_quantitat_df = food_comarca_any_df.merge(beneficiaris_df, left_index=True, right_on=['NomComarca','Any'], how='right')

  beneficiaris_quantitat_df.loc[beneficiaris_quantitat_df.Quantitat.isna(),'Quantitat'] = 0
  beneficiaris_quantitat_df.Any = beneficiaris_quantitat_df.Any.apply(lambda x: int(x[:4]))

  poblacio_df = load_poblacio(path,stack=True)
  beneficiaris_quantitat_df = beneficiaris_quantitat_df.merge(poblacio_df, how='left', left_on = ['NomComarca','Any'], right_on = ['NomComarca','Any'])

  beneficiaris_quantitat_df['Quantitat_Normalitzada'] = beneficiaris_quantitat_df.Quantitat * 1000 / beneficiaris_quantitat_df.Poblacio
  beneficiaris_quantitat_df['Beneficiaris_Normalitzat'] = beneficiaris_quantitat_df.Beneficiaris * 1000 / beneficiaris_quantitat_df.Poblacio
  beneficiaris_quantitat_df['Quantitat_Normalitzada'] = beneficiaris_quantitat_df['Quantitat_Normalitzada'].apply(lambda x: round(x,2))
  beneficiaris_quantitat_df.loc[beneficiaris_quantitat_df.Beneficiaris_Normalitzat.isna(),['Beneficiaris_Normalitzat','Quantitat_Normalitzada','Poblacio']]= 0
  beneficiaris_quantitat_df['Beneficiaris_Normalitzat'] = beneficiaris_quantitat_df.Beneficiaris_Normalitzat.apply(lambda x: round(x,0))

  return beneficiaris_quantitat_df
