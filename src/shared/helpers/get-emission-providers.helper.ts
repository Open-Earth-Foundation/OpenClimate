export const getEmissionProviders = async () => {
    let countryParsed =  await fetch(`/api/country/2019`, {
        method: 'GET',
    });
    const jsonData = await countryParsed.json()
    
    const data = jsonData.data.map((data:any)=> {
        return data.Emissions 
    });

    const providers = data.map((p:any)=> p.map((p:any)=>p.DataProvider));
    const y = providers.filter((data:any)=> data.length == 3);
    
    const uniq = y[0].map((data:any)=> {
        return {
            providerId: data.data_provider_id,
            providerName: data.data_provider_name
        }
    })
    uniq.pop()
    return uniq    
}

export const getSubnationalProviders = async () => {
    let snParsed =  await fetch(`/api/subnationals/2018/15`, {
        method: 'GET',
    });
    const jsonD = await snParsed.json()
    
    const sndata = jsonD.data.map((data:any)=> {
        return data.Emissions 
    });
    const snproviders = sndata.map((p:any)=> p.map((p:any)=>p.DataProvider));
    const sny = snproviders
    
    const uniqy = sny[0].map((data:any)=> {
        return {
            providerId: data.data_provider_id,
            providerName: data.data_provider_name
        }
    }) 

    return uniqy
}


export const getCityProviders = async () => {
    let snParsed =  await fetch(`/api/city/2021/196/`, {
        method: 'GET',
    });
    const jsonD = await snParsed.json()
    
    const sndata = jsonD.data.map((data:any)=> {
        return data.Emissions 
    });
    const snproviders = sndata.map((p:any)=> p.map((p:any)=>p.DataProvider));
    const sny = snproviders
    
    const uniqy = sny[0].map((data:any)=> {
        return {
            providerId: data.data_provider_id,
            providerName: data.data_provider_name,
        }
    })

    return uniqy
}
