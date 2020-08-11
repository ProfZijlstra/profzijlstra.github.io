fetch(
    `http://mumstudents.org/cs472/2013-09/Sections/8/ajaxpets/ajaxpets.php?animal=puppy`,
    {
        method: "GET"
    }
)
    .then((rsp) => {
        return rsp.text();
    })
    .then((data) => {
        console.log(data);
    }); 
