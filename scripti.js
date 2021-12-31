async function myFetch() {
    const query = 'https://www.musicbrainz.org/ws/2/artist?query=coldplay'
    const xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = function () {
        const div = document.getElementById('div')
        try {
            var result = JSON.parse(this.response.toString())
            console.log(result.artists)
            // for (artist of result.artists) {
            //     var p = document.createElement('p')
            //     p.innerHTML = artist.name
            //     div.appendChild(p)
            // }
        } catch (e) {

        }
    }
    await xhttp.open('GET', query)
    xhttp.setRequestHeader('Accept', 'application/json')
    await xhttp.send()
}

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

const input = document.getElementById('input')
input.addEventListener('keyup', searchArtist)

// async function searchWorks() {
//     const input = document.getElementById('input')
//     const xhr = new XMLHttpRequest()
//     xhr.onreadystatechange = async function () {
//
//     }
//     xhr.open()
//     xhr.setRequestHeader()
//     xhr.send(null)
// }
//
// const btn = document.getElementById('searchButton')
// btn.addEventListener('click', searchWorks)