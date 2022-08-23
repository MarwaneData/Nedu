// const url = window.location.href
// const searchForm = document.getElementById('search-form')
// const searchInput = document.getElementById('search-input')
// const resultsBox = document.getElementById('results-box')

// const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value

// const sendSearchData = (cour) =>{
//     $.ajax({
//         type: 'POST',
//         url:'search/',
//         data: {
//             'csrfmiddlewaretoken': csrf,
//             'cour': cour,
//         },
//         success: (res)=>{
//             console.log(res)
//         },
//         error: (err)=>{
//             console.log(err)
//         }
//     })
// }

// searchInput.addEventListener('keyup', e=>{
//     console.log(e.target.value)
//     if(resultsBox.classList.contains('invisible')){
//         resultsBox.classList.remove('invisible')
//     }
//     sendSearchData(e.target.value)
// })
