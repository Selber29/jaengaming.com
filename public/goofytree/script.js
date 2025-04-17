const animatedElement = document.querySelector('body');
let randomTime = Math.floor(Math.random() * 2500);

document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(doJumpscares, randomTime);
});

function doJumpscares() {
    const jumpscarefiles = [ "luigi.jpg", "cat.jpg", "amogus.webp", "peta.png", "wadafaq.webp", "wega2.webp", "WegaFlash.gif", "realjumpscares.webp", "peppinius.webp", "minkai.webp", "minkaidos.webp" ];
    const top5scariestjumpscare = new Audio('SCREAM.mp3');
    const playbackRate = Math.random() * (2 - 0.2) + 0.2;
    top5scariestjumpscare.playbackRate = playbackRate;
    top5scariestjumpscare.play();
    if (document.querySelector('.luigi').classList.contains('funni')) {
        document.querySelector('.luigi').classList.remove('funni');
    }
    document.querySelector('.luigi').classList.add('funni');
    document.querySelector('.luigi.funni').style.setProperty('--nige', `${1000 / playbackRate}ms`);
    console.log('Luigi is coming for you', 1000 / playbackRate);
    document.querySelector('.luigi').src = jumpscarefiles[Math.floor(Math.random() * jumpscarefiles.length)];
    setTimeout(() => {
        document.querySelector('.luigi').classList.remove('funni');
        randomTime = Math.floor(Math.random() * 2500)
        setTimeout(doJumpscares, randomTime);
    }, 1000 / playbackRate);

}
