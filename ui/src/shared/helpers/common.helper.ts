const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

// Turn enum into array
function EnumToArray(enumme: any) {
    return Object.keys(enumme)
        .filter(StringIsNumber)
        .map(key => enumme[key]);
}

function GroupByKey(array: Array<any>, key: string) {
    return array
      .reduce((hash, obj) => {
        if(obj[key] === undefined) return hash; 
        return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
      }, {})
 }
 
 function HandleResponse(response: any) {
  return response.text().then((text: any) => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
          if (response.status === 401) {
              //window.location.reload();
          }

          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
      }

      return data;
  });
}

export const CommonHelper = {
    StringIsNumber,
    EnumToArray,
    GroupByKey,
    HandleResponse
};