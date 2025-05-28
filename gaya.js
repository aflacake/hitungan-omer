document.addEventListener('DOMContentLoaded', function() {
    const fontTautan = document.createElement("link");
    fontTautan.href = "https://fonts.googleapis.com/css2?family=Lora&display=swap";
    fontTautan.rel = "stylesheet"
    document.head.appendChild(fontTautan);

    const styleTag = document.createElement("style");
    styleTag.textContent = `
        body {
            padding: 0;
            margin; 0;
            font-family: 'Lora', serif;
            line-height: 1.6;
        }

        #gmbrKover {
            margin: 0;
        }

        #negara {
            margin-top: -10px;
        }

        #kalenderOmer {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 20px;
            justify-content: center;
            align-items: center;
        }
            .kotakHari {
                display: flex;
                width: 50px;
                height: 50px;
                padding: 10px 20px;
                font-size: 24px;
                align-items: center;
                justify-content: center;
                text-align: center;
                border: 1px solid #ccc;
            }
            .aktif {
                background-color: gold;
                font-weight: bold;
            }
            .lagbaomer {
                background-color: orange;
                color: white;
            }

        .omerHitung {
            display: flex;
            flex-direction: column;
            padding: 20px;
            margin: 20px;
            text-align: center;
        }
            #kontenOmer {
                margin-top: -10px;
            }
            #lokasi, #hariOmer {
                font-weight: bold;
            }

        #notifPro {
            padding: 20px;
            margin: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        footer {
            padding: 20px;
            margin: 0;
            margin-top: 50px;
            background-color: #ccc;
            display: row;
        }
            #gmbrCttnkaki {
                display: block;
                padding: 10px;
                margin: 0 auto;
            }
            #tentang2 {
                margin-top: -10px;
            }
            #sosial a {
                color: black !important;
            }
    `;

    document.head.appendChild(styleTag);

    // Konten Omer
    document.getElementById("negara").textContent = "Hanya untuk lokasi negara Indonesia"

    document.getElementById("kontenOmer").textContent = "Memungkinkan bagi Anda sebagai seorang Yahudi yang taat untuk mengambil langkah kemajuan dalam perhitungan Omer digital";

    document.getElementById("notifPro").textContent = "Menggunakan aplikasi-web ini pada saat jam setelah matahari terbenam + beberapa menit (biasanya sekitar 40-72 menit setelah sunset), tergantung pada lokasi dan tradisi atau mengaksesnya setelah waktu 'Tzeit Hakochavim' yaitu waktu keluarnya bintang-bintang";

    document.getElementById("tentang").textContent = "2025 oleh Nazwa Shabrina Zain dibuat oleh cinta";

    document.getElementById("tentang2").textContent = "Hak cipta semua milik Nazwa Shabrina Zain kecuali dinyatakan lain.";

    document.getElementById("sosial").textContent = "Facebook";
});
