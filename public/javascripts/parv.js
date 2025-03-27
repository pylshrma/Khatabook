document.getElementById('icon-1').addEventListener('click', function() {
    document.body.classList.add('theme-black');
    document.body.classList.remove('theme-white');
});

document.getElementById('icon-2').addEventListener('click', function() {
    document.body.classList.add('theme-white');
    document.body.classList.remove('theme-black');
});


var date=document.querySelector("#bydate");

date.addEventListener("click",function(event)
{
    const dates = document.querySelector(".dates");
   if(dates.classList.contains("hidden"))
{
    dates.classList.remove("hidden");
    console.log(dates.classList);
}
else
{
    dates.classList.add("hidden");
   
}
})