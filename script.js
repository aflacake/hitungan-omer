document.addEventListener('DOMContentLoaded', function() {
// Kalender
function tampilkanKalenderOmer(hariAktif) {
    const kontainer = document.getElementById("kalenderOmer");
    kontainer.innerHTML = "";

    for (let i = 1; i <= 49; i++) {
        const kotak = document.createElement("div");
        kotak.classList.add("kotakHari");
        kotak.textContent = i;

        if (i === 33) {
            kotak.classList.add("lagbaomer");
            kotak.title = "Lag BaOmer";
        }

        if (i === hariAktif) {
            kotak.classList.add("aktif");
        }
        kontainer.appendChild(kotak);
    }
}



// Meminta lokasi
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        if (position && position.coords) {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            console.log(lat, long);

            document.getElementById("lokasi").textContent = `Lokasi Anda: latitude ${lat.toFixed(5)}, longitude ${long.toFixed(5)}`;

            const saatIni = new Date();
            const besok = new Date(saatIni);
            besok.setDate(saatIni.getDate() + 1);

            const hariIniStr = saatIni.toISOString().split('T')[0];
            const besokStr = besok.toISOString().split('T')[0];

            fetch(`https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${long}&date=${hariIniStr}`)
            .then(response => {
                if (!response.ok) throw new Error(`Hebcal Zmanim API error ${response.status}`);
                return response.json();
            })
            .then(zmanimData => {
                console.log("Data zmanim:", zmanimData);

                const tzeitStr = zmanimData.times?.tzeit42min || zmanimData.times?.tzeit50min || zmanimData.times?.tzeit || null;
                let waktuTzeit = tzeitStr ? new Date(tzeitStr) : null;


                const hebcalUrl = `https://www.hebcal.com/hebcal?cfg=json&start=${hariIniStr}&end=${besokStr}&geo=pos&latitude=${lat}&longitude=${long}&m=50&maj=on&min=on&mod=on&nx=on&ss=on`;

                fetch(hebcalUrl)
                    .then(response => {
                        if (!response.ok) throw new Error(`Hebcal API error ${response.status}`);
                        return response.json();
                    })
                    .then(data => {
                        console.log("Data dari Hebcal:", data);
                        console.log("Items dari API:", data.items.map(i => [i.date, i.category, i.title]));

                        if (!data || !Array.isArray(data.items)) {
                            throw new Error("Data tidak valid atau items tidak tersedia");
                        }

                        const tzeitItem = data.items.find(item =>
                            item.category === 'zmanim' &&
                            item.title.toLowerCase().includes('tzeit')
                        );

                        const omerItemHariIni = data.items.find(item =>
                            item.category === 'omer' && item.date.startsWith(hariIniStr)
                        );

                        const omerItemBesok = data.items.find(item =>
                            item.category === 'omer' && item.date.startsWith(besokStr)
                        );

                        const waktuSekarang = new Date();
                        let omerItemTampilan = null;

                        if (waktuTzeit) {
                            if (waktuSekarang >= waktuTzeit) {
                                omerItemTampilan = omerItemBesok || omerItemHariIni;
                            } else {
                                omerItemTampilan = omerItemHariIni;
                                document.getElementById("hariOmer").textContent = "Tunggu sampai setelah matahari terbenam untuk melihat hitungan Omer hari ini.";
                            }
                        } else {
                            console.warn("Waktu tzeit tidak ditemukan. Menampilkan Omer hari ini sebagai fallback.");
                            omerItemTampilan = omerItemHariIni;
                        }

                        if (omerItemTampilan) {
                            const hariAngka = omerItemTampilan.title.match(/Day (\d+)/);
                            if (hariAngka) {
                                const hariOmer = parseInt(hariAngka[1]);
                                document.getElementById("hariOmer").textContent = `Hari Omer :${omerItemTampilan.hebrew} || ${omerItemTampilan.title}`;
                                tampilkanKalenderOmer(hariOmer);
                            } else {
                                document.getElementById("hariOmer").textContent = omerItemTampilan.title;
                            }
                        } else {
                            document.getElementById("hariOmer").textContent = "Sekarang di luar periode Hitungan Omer (Pesach - Shavuot).";
                            tampilkanKalenderOmer(0);
                        }
                    })
                    .catch(error => {
                        console.error("Gagal mengambil data Omer:", error);
                        document.getElementById("hariOmer").textContent = "Gagal mengambil data Omer.";
                    });
                })
                .catch(error => {
                    console.error("Gagal mengambil data Zmanim:", error);

                    const hebcalUrl = `https://www.hebcal.com/hebcal?cfg=json&start=${hariIniStr}&end=${besokStr}&geo=pos&latitude=${lat}&longitude=${long}&m=50&maj=on&min=on&mod=on&nx=on&ss=on`;

                    fetch(hebcalUrl)
                        .then(response => {
                            if (!response.ok) throw new Error(`Hebcal API error ${response.status}`);
                            return response.json();
                        })
                        .then(data => {
                            const omerItemHariIni = data.items.find(item => 
                                item.category === 'omer' && item.date.startsWith(hariIniStr)
                            );

                            if (omerItemHariIni) {
                                document.getElementById("hariOmer").textContent = `Hari Omer :${omerItemHariIni.hebrew} || ${omerItemHariIni.title}`;
                            } else {
                                document.getElementById("hariOmer").textContent = omerItemTampilan.title;
                            }
                        })
                        .catch(error => {
                          console.error("Gagal mengambil data Omer falllback:", error);
                          document.getElementById("hariOmer").textContent = "Gagal mengambil data Omer.";
                        });
                    });
            } else {
                document.getElementById("lokasi").textContent = "Gagal membaca koordinat.";
            }

    }, function(error) {
        document.getElementById("lokasi").textContent = `Gagal mendapatkan lokasi: ${error.message}`;
        document.getElementById("hariOmer").textContent = "Tidak dapat menampilkan hari hitungan Omer tanpa lokasi";
    });
  } else {
      document.getElementById("lokasi").textContent = "Geolokasi tidak didukung di browser ini.";
      document.getElementById("hariOmer").textContent = "Tidak dapat menampilkan hari hitungan Omer tanpa lokasi";
  }
});
