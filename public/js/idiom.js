
function initialIdiom()
{
   
    fetch( "/api/idiom")
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        document.getElementById('Idiom').innerHTML = data["Idiom"];
        document.getElementById('Description').innerHTML = data['Meaning'];
        document.getElementById('Origin').innerHTML = data['Origin'];
        
    });  };

    
  
let idiomCounter = 0;






initialIdiom();


const d = new Date();
document.getElementById("date").innerHTML = d.toDateString();




