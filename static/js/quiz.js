window.onload = initall;
var saveAnsButton;

function initall(){
    saveAnsButton = document.getElementById('save_ans')
    saveAnsButton.onclick = saveans
}

function saveans(){
    saveAnsButton.style.background="rgb(24, 128, 83)"

    var ans = $("input:radio[name=q_answer]:checked").val()

    var req = new XMLHttpRequest();
    
    var url = '/saveans?ans='+ans

    req.open("GET",url,true)
    req.send()
}