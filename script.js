document.addEventListener('DOMContentLoaded', function() {
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

            const hebcalUrl = `https://www.hebcal.com/hebcal?cfg=json&start=${hariIniStr}&end=${besokStr}&geo=pos&latitude=${lat}&longitude=${long}&m=50`;

            fetch(hebcalUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Hebcal API error ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Data dari Hebcal:", data);

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
                    let waktuTzeit = null;
                    let omerItemTampilan = null;

                    if (tzeitItem) {
                        const waktuTzeit = new Date(tzeitItem.date);

                        if (waktuSekarang >= waktuTzeit) {
                            omerItemTampilan = omerItemBesok || omerItemHariIni;
                        } else {
                            document.getElementById("hariOmer").textContent = "Tunggu sampai setelah matahari terbenam untuk melihat hitungan Omer hari ini.";
                            return;
                        }
                    } else {
                        omerItemTampilan = omerItemHariIni;
                    }

                    if (omerItemTampilan) {
                        const hariAngka = omerItemTampilan.title.match(/Day (\d+)/);
                        if (hariAngka) {
                            document.getElementById("hariOmer").textContent = `Hari ke-${hariAngka[1]} dari Omer`;
                        } else {
                            document.getElementById("hariOmer"). textContent = omerItemTampilan.title;
                        }
                    } else {
                        document.getElementById("hariOmer").textContent = "Hitungan Omer telah selesai atau belum dimulai."
                    }
                })
                .catch(error => {
                    console.error("Gagal mengambil data Omer:", error);
                    document.getElementById("hariOmer").textContent = "Gagal mengambil data Omer."
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
