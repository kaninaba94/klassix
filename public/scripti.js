// // commented out to check whether the presence of a cross-origin request prevents proper loading of the heroku app
// async function myFetch() {
//     const query = 'https://www.musicbrainz.org/ws/2/artist?query=coldplay'
//     const xhttp = new XMLHttpRequest()
//
//     xhttp.onreadystatechange = function () {
//         const div = document.getElementById('div')
//         try {
//             var result = JSON.parse(this.response.toString())
//             console.log(result.artists)
//             // for (artist of result.artists) {
//             //     var p = document.createElement('p')
//             //     p.innerHTML = artist.name
//             //     div.appendChild(p)
//             // }
//         } catch (e) {
//
//         }
//     }
//     await xhttp.open('GET', query, true)
//     xhttp.setRequestHeader('Accept', 'application/json')
//     await xhttp.send(null)
// }

async function searchArtist() {
    var input = document.getElementById('input')
    var query = input.value.toLowerCase()
    const div = document.getElementById('div')
    const lis = div.getElementsByTagName('li')
    for (li of lis) {
        //TODO: remove allocated spaces for anchortags when not displaying them
        var a = li.getElementsByTagName('a')[0]
        var txtValue = a.textContent || a.innerText
        if (txtValue.toLowerCase().indexOf(input.value.toLowerCase()) > -1) {
            li.style.display = 'block'
        } else {
            li.style.display = 'none'
        }
    }
}

// async function showComposerWorks() {
//     const xhr = new XMLHttpRequest()
//     xhr.onreadystatechange = async function () {
//
//     }
//     const query = `https://www.musicbrainz.org/ws/2/work?artist=${this.id}`
//     await xhr.open('GET', query)
//     xhr.setRequestHeader('Accept', 'application/json')
//     // xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
//     await xhr.send()
// }

const input = document.getElementById('input')
input.addEventListener('keyup', searchArtist)

const div = document.getElementById('div')
// const anchors = div.getElementsByTagName('a')
// for (a of anchors) {
//     a.addEventListener('click', showComposerWorks)
// }

const btn = document.getElementById('button')
btn.addEventListener('click', myFetch)