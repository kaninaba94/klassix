async function searchArtist() {
    var input = document.getElementById('input')
    const div = document.getElementById('compDiv')
    const lis = div.getElementsByTagName('li')
    for (li of lis) {
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

const div = document.getElementById('compDiv')
const input = document.getElementById('input')
input.addEventListener('keyup', searchArtist)

// const anchors = div.getElementsByTagName('a')
// for (a of anchors) {
//     a.addEventListener('click', showComposerWorks)
// }
