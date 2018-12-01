var image = new image();

fetch('/upload').then((res) => 
{
    res.json().then((data) => 
    {
        console.log(data);
    })
});