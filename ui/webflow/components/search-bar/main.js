 $(document).ready(function(){
  	// hide the dropdown on page load
  	$('#searchResults').hide()
    
    // add event listener to the input and get target value
    $('#name').keyup((e) => {
    	// store the value and modify the string
    	const queryString = e.target.value
      let modifiedSearchString = "";
      const searchStringSplit = queryString.split(" ");
       
      searchStringSplit.map((string, index) => {
        const newString = string.charAt(0).toUpperCase() + string.slice(1);
          if (index === searchStringSplit.length - 1) {
            modifiedSearchString = modifiedSearchString + newString;
          } else {
            modifiedSearchString = modifiedSearchString + newString + " ";
          }
        });
        
        // send and ajax request if value is greater than 3 characters in total
        if(modifiedSearchString.length >= 3){
        	const query = modifiedSearchString.trim()
        	$.ajax({
            method: 'GET',
            url: `https://openclimate.openearth.dev/api/v1/search/actor?q=${modifiedSearchString}`,
            success: function(res){
              console.log(res)
              // map (loop) through results and destructure key vals
              const el = res.data.map(({actor_id, name, root_path_geo, has_data, type}) => {
              
              const parentPath = root_path_geo.reverse().slice(1)
                            
                const renderParentPath = (path) => {
                  let pathString = "";

                  path?.map((parent) => {
                    if (pathString) {
                      pathString = pathString + " > ";
                    }
                    pathString = pathString + parent.name.toUpperCase();
                  });

                  return pathString;
                };
                
                console.log(root_path_geo)
              	
                                
                const renderActorType = (type) => {
                	switch (type) {
                    case "city":
                      return "City";
                    case "organization":
                    case "site":
                      return "Company";
                    case "adm1":
                      return "Region/Province";
                    case "country":
                    default:
                      return "Country";
                  }
                }
                
                const nonPathActor = (type) => {
                  switch (type) {
                    case "site":
                    case "organization":
                    case "country":
                      return true;
                    default:
                      return false;
                  }
                };
                
              	return (
                  `<a id ="dropdown-item" href="https://openclimate.openearth.dev/actor/${actor_id}/${name}_emissions">
                  	<div class="item-wrapper">
                    	<span>${name}<span>
                      <div>
                        <span id="geo">${parentPath?.length > 0 && !nonPathActor(type) ? renderParentPath(parentPath) : renderActorType(type)}</span>
                      </div>
                    </div>
                    <div>
                    	${has_data ? "" :
                      	`<span class="material-symbols-outlined">
                    			data_alert
                      </span>`
                      }
                    </div>
                  </a> <br/ >`
               )
              })
              $('#input-wrapper').css({
              	"border-radius": "20px 20px 0px 0px",
                "border": "1px solid #008600"
              })
              $('#searchResults').show();
              $('#searchResults').html(el);
            }
          }) 
        }
        else {
        	$('#searchResults').hide();
          $('#input-wrapper').css({
              	"border-radius": "50px"
            })
        }
    })
 });
