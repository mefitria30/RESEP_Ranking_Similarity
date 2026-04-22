from flask import Flask, request, render_template
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import logging

# Konfigurasi logging
logging.basicConfig(
    level=logging.INFO,  # bisa diganti DEBUG untuk detail lebih banyak
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log"),  # simpan log ke file app.log
        logging.StreamHandler()          # tampilkan juga di console
    ]
)

app = Flask(__name__)
df = pd.read_pickle("recipe_vectors.pkl")

def ranking_similarity(nama_resep, top_n=9, alpha=0.7):
    """
    alpha = bobot untuk bahan (0.0–1.0)
    (1-alpha) = bobot untuk teks
    """
    logging.debug(f"Menghitung similarity untuk resep: {nama_resep} dengan alpha={alpha}")

    # Ambil vector target
    v_target_bahan = df.loc[df["nama_resep"] == nama_resep, "vector_bahan"].values[0]
    v_target_text = df.loc[df["nama_resep"] == nama_resep, "vector_text"].values[0]

    # Copy dataframe biar aman
    df_temp = df.copy()
    df_temp["similarity"] = df_temp.apply(
        lambda row: alpha * cosine_similarity([v_target_bahan],[row["vector_bahan"]])[0][0] +
                    (1-alpha) * cosine_similarity([v_target_text],[row["vector_text"]])[0][0],
        axis=1
    )

    # Urutkan dari paling mirip
    hasil = df_temp.sort_values("similarity", ascending=False)

    logging.info(f"Ranking selesai untuk resep '{nama_resep}', top {top_n} rekomendasi dihasilkan.")
    return hasil.head(top_n)[[
        "nama_resep", "kategori", "waktu_masak", "similarity",
        "list_bahan", "vector_bahan"
    ]]

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        nama_resep = request.form["nama_resep"]

        # Validasi: cek apakah resep ada di dataset
        if nama_resep not in df["nama_resep"].values:
            pesan_error = f"Resep '{nama_resep}' tidak ditemukan dalam database."
            logging.warning(pesan_error)
            return render_template("home.html", error=pesan_error, resep_list=df["nama_resep"].tolist())

        hasil = ranking_similarity(nama_resep, top_n=9)
        logging.info(f"Resep '{nama_resep}' ditemukan, menampilkan hasil rekomendasi.")
        return render_template("result.html", resep=nama_resep, hasil=hasil.to_dict(orient="records"))
    
    logging.debug("Halaman utama diakses tanpa pencarian.")
    return render_template("home.html", resep_list=df["nama_resep"].tolist())

@app.route("/recommend")
def recommend():
    nama_resep = request.args.get("nama_resep")

    if nama_resep not in df["nama_resep"].values:
        pesan_error = f"Resep '{nama_resep}' tidak ditemukan."
        logging.warning(pesan_error)
        return render_template("home.html", error=pesan_error, resep_list=df["nama_resep"].tolist())

    hasil = ranking_similarity(nama_resep, top_n=9)
    logging.info(f"Resep '{nama_resep}' direkomendasikan dengan {len(hasil)} hasil.")
    return render_template("result.html", resep=nama_resep, hasil=hasil.to_dict(orient="records"))

if __name__ == "__main__":
    logging.info("Aplikasi Flask dimulai...")
    app.run(debug=True)
