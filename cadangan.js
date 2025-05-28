document.addEventListener('DOMContentLoaded', function() {
// Kalender
function tampilkanKalenderOmer(hariAktif) {
    const kontainer = document.getElementById("kalenderOmer");
    kontainer.innerHTML = "";

    if (hariAktif < 1 || hariAktif > 49) {
        kontainer.textContent = "Hari ini diluar periode Omer.";
        return;
    }

    const kotak = document.createElement("div");
    kotak.classList.add("kotakHari");
    kotak.textContent = `${hariAktif}`;

    if (hariAktif === 33) {
        kotak.classList.add("lagbaomer");
        kotak.title = "Lag BaOmer";
    }
    kontainer.appendChild(kotak);
}



const lokasiEl = document.getElementById("lokasi");
const hariOmerEl = document.getElementById("hariOmer");

// Meminta lokasi
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        lokasiEl.textContent = `Lokasi Anda: latitude ${lat.toFixed(5)}, longtitude ${long.toFixed(5)}`;

        const mulaiOmer = new Date('2025-04-13T18:00:00');
        const hariIni = new Date();

        // Selisih
        const waktuBerbeda = hariIni - mulaiOmer;
        const hariBerbeda = Math.floor(waktuBerbeda / (1000 * 60 * 60 * 24)) + 1;

        // Periode Omer dalam 49 hari
        let teksOmer = "";
        if (hariBerbeda >= 1 && hariBerbeda <= 49) {
            teksOmer = `Hari ke-${hariBerbeda} dari Omer`;
        } else if (hariBerbeda < 1) {
            teksOmer  = "Hitungan Omer belum dimulai";
        } else {
        teksOmer = "Hitungan Omer telah selesai";
        }
        hariOmerEl.textContent = teksOmer;

        tampilkanKalenderOmer(hariBerbeda >= 1 && hariBerbeda <= 49 ? hariBerbeda : 0);

    }, function(error) {
        lokasiEl.textContent = `Tidak dapat mengambil lokasi Anda saat ini: ${error.message}`;
        hariOmerEl.textContent = "Lokasi diperlukan untuk menentukan hari Omer secara akurat.";
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
} else {
    lokasiEl.textContent = "Geolokasi tidak didukung di browser ini.";
    hariOmerEl.textContent = "Tidak dapat menentukan hariOmer tanpa lokasi.";
}

});
