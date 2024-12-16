// Konstanta
        const rows = 25;
        const cols = 45;
        const totalSlots = rows * cols;
        const baseAddress = 0x80071DFC; // Alamat memori awal
        const offset = 4; // Penambahan per alamat
        const addressesPerSlot = 2; // Setiap slot memiliki 2 alamat

        // Variabel dinamis
        const farmLayout = document.getElementById("farmLayout");
        const generateButton = document.getElementById("generateButton");
        const resetButton = document.getElementById("resetButton");
        let memoryData = Array.from({ length: totalSlots }, () => ["0000", "0000"]); // Data default untuk semua slot
        let selectedOption = null; // Opsi aktif
        let selectedClass = null; // Kelas warna aktif

        // Pisahkan ID dan Value dari data yang dipilih
        function splitValue(value) {
            const [id, val] = value.split("-");
            return { id, val };
        }

        // Pilih opsi menggunakan tombol
        document.querySelectorAll(".options button").forEach(button => {
            button.addEventListener("click", () => {
                if (button.classList.contains("active")) {
                    // Jika tombol sudah aktif, unselect
                    button.classList.remove("active");
                    selectedOption = null;
                    selectedClass = null;
                } else {
                    // Nonaktifkan semua tombol
                    document.querySelectorAll(".options button").forEach(btn => btn.classList.remove("active"));
                    // Aktifkan tombol yang dipilih
                    button.classList.add("active");
                    selectedOption = button.dataset.value; // Ambil nilai opsi
                    selectedClass = button.classList[0]; // Ambil kelas warna
                }
            });
        });

        // Membuat grid layout
        for (let i = 0; i < totalSlots; i++) {
            const slot = document.createElement("div");
            slot.className = "slot";
            slot.dataset.index = i; // Simpan indeks slot
            farmLayout.appendChild(slot);
        }

        // Klik pada slot
        farmLayout.addEventListener("click", (e) => {
            if (e.target.classList.contains("slot")) {
                const slotIndex = e.target.dataset.index;

                if (e.target.classList.contains("selected")) {
                    // Jika sudah dipilih, batalkan
                    memoryData[slotIndex] = ["0000", "0000"];
                    e.target.className = "slot"; // Reset kelas
                } else if (selectedOption) {
                    // Jika belum dipilih, pilih dan set data
                    const { id, val } = splitValue(selectedOption);
                    memoryData[slotIndex] = [id, val];
                    e.target.className = `slot selected ${selectedClass}`; // Tambahkan kelas warna
                }
            }
        });

        // Generate dan unduh file
        generateButton.addEventListener("click", () => {
            let result = "";
            memoryData.forEach((values, index) => {
                const address1 = (baseAddress + index * addressesPerSlot * offset).toString(16).toUpperCase();
                const address2 = (baseAddress + (index * addressesPerSlot + 1) * offset).toString(16).toUpperCase();

                result += `${address1} ${values[0]}\n`;
                result += `${address2} ${values[1]}\n`;
            });

            // Membuat file untuk diunduh
            const blob = new Blob([result], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "farm_layout.txt";
            link.click();
        });

        // Reset layout
        resetButton.addEventListener("click", () => {
            memoryData = Array.from({ length: totalSlots }, () => ["0000", "0000"]);
            document.querySelectorAll(".slot").forEach(slot => slot.className = "slot");
            document.querySelectorAll(".options button").forEach(button => button.classList.remove("active"));
        });