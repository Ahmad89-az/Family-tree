// Dummy data keluarga besar - 4 generasi, 36 anggota
// Struktur: id, name, nickname, gender, birthDate, deathDate, photo, father, mother, spouse[], children[]

const avatar = (seed, gender) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e2e8f0`;

export const familyMembers = [
  // ===== GENERASI 1 =====
  {
    id: '1', name: 'H. Abdullah Rahman', nickname: 'Abdullah', gender: 'Male',
    birthDate: '1932-03-12', deathDate: '2005-11-02', photo: avatar('abdullah'),
    father: null, mother: null, spouse: ['2'], children: ['3', '4', '5', '6'],
    address: 'Banjarbaru, Kalimantan Selatan', occupation: 'Petani & Tokoh Masyarakat',
    education: 'Sekolah Rakyat', notes: 'Pendiri keluarga besar, dikenal sebagai tokoh yang dihormati di kampung.',
    gallery: [avatar('abdullah-1'), avatar('abdullah-2')],
  },
  {
    id: '2', name: 'Hj. Siti Aminah', nickname: 'Aminah', gender: 'Female',
    birthDate: '1936-07-20', deathDate: '2010-01-15', photo: avatar('aminah'),
    father: null, mother: null, spouse: ['1'], children: ['3', '4', '5', '6'],
    address: 'Banjarbaru, Kalimantan Selatan', occupation: 'Ibu Rumah Tangga',
    education: 'Sekolah Rakyat', notes: 'Dikenal sangat telaten merawat anak-anak dan cucu.',
    gallery: [avatar('aminah-1')],
  },

  // ===== GENERASI 2 (anak dari 1 & 2) =====
  {
    id: '3', name: 'Drs. Ahmad Rahman', nickname: 'Ahmad', gender: 'Male',
    birthDate: '1955-01-10', deathDate: null, photo: avatar('ahmad'),
    father: '1', mother: '2', spouse: ['7'], children: ['12', '13', '14'],
    address: 'Banjarmasin, Kalimantan Selatan', occupation: 'Guru & Kepala Sekolah',
    education: 'S1 Pendidikan - IKIP Banjarmasin', notes: 'Anak sulung, meneruskan tradisi keluarga sebagai pendidik.',
    gallery: [avatar('ahmad-1')],
  },
  {
    id: '4', name: 'Fatimah Rahman', nickname: 'Fatimah', gender: 'Female',
    birthDate: '1958-05-22', deathDate: null, photo: avatar('fatimah'),
    father: '1', mother: '2', spouse: ['8'], children: ['15', '16'],
    address: 'Martapura, Kalimantan Selatan', occupation: 'Pedagang',
    education: 'SMA', notes: 'Mengelola usaha kain sasirangan turun-temurun.',
    gallery: [],
  },
  {
    id: '5', name: 'H. Muhammad Yusuf', nickname: 'Yusuf', gender: 'Male',
    birthDate: '1961-09-03', deathDate: null, photo: avatar('yusuf'),
    father: '1', mother: '2', spouse: ['9'], children: ['17', '18', '19'],
    address: 'Palangkaraya, Kalimantan Tengah', occupation: 'Wiraswasta',
    education: 'S1 Ekonomi - Universitas Lambung Mangkurat', notes: 'Merantau ke Kalimantan Tengah, membangun usaha konstruksi.',
    gallery: [],
  },
  {
    id: '6', name: 'Khadijah Rahman', nickname: 'Ijah', gender: 'Female',
    birthDate: '1964-12-18', deathDate: null, photo: avatar('khadijah'),
    father: '1', mother: '2', spouse: ['10'], children: ['20', '21'],
    address: 'Banjarbaru, Kalimantan Selatan', occupation: 'Bidan',
    education: 'D3 Kebidanan', notes: 'Anak bungsu, tinggal dekat dengan rumah orang tua.',
    gallery: [],
  },

  // Pasangan Generasi 2
  { id: '7', name: 'Hj. Rahmah Sari', nickname: 'Rahmah', gender: 'Female', birthDate: '1957-02-14', deathDate: null, photo: avatar('rahmah'), father: null, mother: null, spouse: ['3'], children: ['12','13','14'], address: 'Banjarmasin', occupation: 'Ibu Rumah Tangga', education: 'SMA', notes: '', gallery: [] },
  { id: '8', name: 'Hasanuddin', nickname: 'Hasan', gender: 'Male', birthDate: '1955-08-30', deathDate: null, photo: avatar('hasan'), father: null, mother: null, spouse: ['4'], children: ['15','16'], address: 'Martapura', occupation: 'Pengrajin Perak', education: 'SMP', notes: '', gallery: [] },
  { id: '9', name: 'Nurhayati', nickname: 'Nur', gender: 'Female', birthDate: '1963-04-25', deathDate: null, photo: avatar('nurhayati'), father: null, mother: null, spouse: ['5'], children: ['17','18','19'], address: 'Palangkaraya', occupation: 'Dosen', education: 'S2 Pendidikan', notes: '', gallery: [] },
  { id: '10', name: 'Zainal Abidin', nickname: 'Zainal', gender: 'Male', birthDate: '1960-06-09', deathDate: null, photo: avatar('zainal'), father: null, mother: null, spouse: ['6'], children: ['20','21'], address: 'Banjarbaru', occupation: 'PNS', education: 'S1 Administrasi', notes: '', gallery: [] },

  // ===== GENERASI 3 =====
  { id: '12', name: 'Muhammad Ridho', nickname: 'Ridho', gender: 'Male', birthDate: '1980-03-17', deathDate: null, photo: avatar('ridho'), father: '3', mother: '7', spouse: ['22'], children: ['28','29'], address: 'Banjarmasin', occupation: 'Software Engineer', education: 'S1 Teknik Informatika - ITB', notes: 'Bekerja di bidang teknologi, mengembangkan aplikasi keluarga ini.', gallery: [] },
  { id: '13', name: 'Aisyah Rahman', nickname: 'Aisyah', gender: 'Female', birthDate: '1983-11-05', deathDate: null, photo: avatar('aisyah'), father: '3', mother: '7', spouse: ['23'], children: ['30'], address: 'Banjarmasin', occupation: 'Dokter', education: 'S1 Kedokteran - Unlam', notes: '', gallery: [] },
  { id: '14', name: 'Ilham Rahman', nickname: 'Ilham', gender: 'Male', birthDate: '1987-06-21', deathDate: null, photo: avatar('ilham'), father: '3', mother: '7', spouse: [], children: [], address: 'Yogyakarta', occupation: 'Arsitek', education: 'S1 Arsitektur - UGM', notes: 'Belum menikah, bekerja di Yogyakarta.', gallery: [] },

  { id: '15', name: 'Siti Nurjannah', nickname: 'Jannah', gender: 'Female', birthDate: '1982-01-30', deathDate: null, photo: avatar('jannah'), father: '4', mother: '8', spouse: ['24'], children: ['31'], address: 'Martapura', occupation: 'Guru', education: 'S1 PGSD', notes: '', gallery: [] },
  { id: '16', name: 'Rizky Hasanuddin', nickname: 'Rizky', gender: 'Male', birthDate: '1985-09-14', deathDate: null, photo: avatar('rizky'), father: '4', mother: '8', spouse: ['25'], children: ['32','33'], address: 'Martapura', occupation: 'Pengusaha', education: 'S1 Manajemen', notes: '', gallery: [] },

  { id: '17', name: 'Fahmi Yusuf', nickname: 'Fahmi', gender: 'Male', birthDate: '1984-04-08', deathDate: null, photo: avatar('fahmi'), father: '5', mother: '9', spouse: ['26'], children: ['34'], address: 'Palangkaraya', occupation: 'Insinyur Sipil', education: 'S1 Teknik Sipil', notes: '', gallery: [] },
  { id: '18', name: 'Salsabila Yusuf', nickname: 'Salsa', gender: 'Female', birthDate: '1988-12-02', deathDate: null, photo: avatar('salsa'), father: '5', mother: '9', spouse: [], children: [], address: 'Palangkaraya', occupation: 'Apoteker', education: 'S1 Farmasi', notes: '', gallery: [] },
  { id: '19', name: 'Reza Yusuf', nickname: 'Reza', gender: 'Male', birthDate: '1991-02-27', deathDate: null, photo: avatar('reza'), father: '5', mother: '9', spouse: [], children: [], address: 'Palangkaraya', occupation: 'Mahasiswa Pascasarjana', education: 'S2 Teknik Elektro', notes: '', gallery: [] },

  { id: '20', name: 'Maulida Zainal', nickname: 'Maulida', gender: 'Female', birthDate: '1986-07-19', deathDate: null, photo: avatar('maulida'), father: '10', mother: '6', spouse: ['27'], children: ['35'], address: 'Banjarbaru', occupation: 'Perawat', education: 'D3 Keperawatan', notes: '', gallery: [] },
  { id: '21', name: 'Fadli Zainal', nickname: 'Fadli', gender: 'Male', birthDate: '1990-10-11', deathDate: null, photo: avatar('fadli'), father: '10', mother: '6', spouse: [], children: [], address: 'Banjarbaru', occupation: 'Pilot', education: 'D4 Penerbangan', notes: '', gallery: [] },

  // Pasangan Generasi 3
  { id: '22', name: 'Dewi Anggraini', nickname: 'Dewi', gender: 'Female', birthDate: '1982-05-16', deathDate: null, photo: avatar('dewi'), father: null, mother: null, spouse: ['12'], children: ['28','29'], address: 'Banjarmasin', occupation: 'Akuntan', education: 'S1 Akuntansi', notes: '', gallery: [] },
  { id: '23', name: 'dr. Farid Wijaya', nickname: 'Farid', gender: 'Male', birthDate: '1981-08-24', deathDate: null, photo: avatar('farid'), father: null, mother: null, spouse: ['13'], children: ['30'], address: 'Banjarmasin', occupation: 'Dokter', education: 'S1 Kedokteran', notes: '', gallery: [] },
  { id: '24', name: 'Taufik Hidayat', nickname: 'Taufik', gender: 'Male', birthDate: '1980-03-03', deathDate: null, photo: avatar('taufik'), father: null, mother: null, spouse: ['15'], children: ['31'], address: 'Martapura', occupation: 'Wirausaha', education: 'SMA', notes: '', gallery: [] },
  { id: '25', name: 'Indah Permata', nickname: 'Indah', gender: 'Female', birthDate: '1987-06-28', deathDate: null, photo: avatar('indah'), father: null, mother: null, spouse: ['16'], children: ['32','33'], address: 'Martapura', occupation: 'Desainer', education: 'S1 Desain', notes: '', gallery: [] },
  { id: '26', name: 'Wulan Sari', nickname: 'Wulan', gender: 'Female', birthDate: '1986-01-09', deathDate: null, photo: avatar('wulan'), father: null, mother: null, spouse: ['17'], children: ['34'], address: 'Palangkaraya', occupation: 'Guru', education: 'S1 Pendidikan', notes: '', gallery: [] },
  { id: '27', name: 'Bayu Kusuma', nickname: 'Bayu', gender: 'Male', birthDate: '1984-11-30', deathDate: null, photo: avatar('bayu'), father: null, mother: null, spouse: ['20'], children: ['35'], address: 'Banjarbaru', occupation: 'Polisi', education: 'Akpol', notes: '', gallery: [] },

  // ===== GENERASI 4 =====
  { id: '28', name: 'Zafran Ridho', nickname: 'Zafran', gender: 'Male', birthDate: '2010-02-14', deathDate: null, photo: avatar('zafran'), father: '12', mother: '22', spouse: [], children: [], address: 'Banjarmasin', occupation: 'Pelajar', education: 'SMP', notes: '', gallery: [] },
  { id: '29', name: 'Alya Ridho', nickname: 'Alya', gender: 'Female', birthDate: '2013-08-09', deathDate: null, photo: avatar('alya'), father: '12', mother: '22', spouse: [], children: [], address: 'Banjarmasin', occupation: 'Pelajar', education: 'SD', notes: '', gallery: [] },
  { id: '30', name: 'Hafiz Farid', nickname: 'Hafiz', gender: 'Male', birthDate: '2015-05-20', deathDate: null, photo: avatar('hafiz'), father: '23', mother: '13', spouse: [], children: [], address: 'Banjarmasin', occupation: 'Pelajar', education: 'SD', notes: '', gallery: [] },
  { id: '31', name: 'Nayla Taufik', nickname: 'Nayla', gender: 'Female', birthDate: '2012-09-12', deathDate: null, photo: avatar('nayla'), father: '24', mother: '15', spouse: [], children: [], address: 'Martapura', occupation: 'Pelajar', education: 'SD', notes: '', gallery: [] },
  { id: '32', name: 'Rafi Rizky', nickname: 'Rafi', gender: 'Male', birthDate: '2011-04-04', deathDate: null, photo: avatar('rafi'), father: '16', mother: '25', spouse: [], children: [], address: 'Martapura', occupation: 'Pelajar', education: 'SMP', notes: '', gallery: [] },
  { id: '33', name: 'Kirana Rizky', nickname: 'Kirana', gender: 'Female', birthDate: '2014-12-25', deathDate: null, photo: avatar('kirana'), father: '16', mother: '25', spouse: [], children: [], address: 'Martapura', occupation: 'Pelajar', education: 'SD', notes: '', gallery: [] },
  { id: '34', name: 'Arka Fahmi', nickname: 'Arka', gender: 'Male', birthDate: '2016-03-08', deathDate: null, photo: avatar('arka'), father: '17', mother: '26', spouse: [], children: [], address: 'Palangkaraya', occupation: 'Pelajar', education: 'SD', notes: '', gallery: [] },
  { id: '35', name: 'Sabrina Bayu', nickname: 'Sabrina', gender: 'Female', birthDate: '2017-07-17', deathDate: null, photo: avatar('sabrina'), father: '27', mother: '20', spouse: [], children: [], address: 'Banjarbaru', occupation: 'Pelajar', education: 'TK', notes: '', gallery: [] },
];

export const ROOT_ID = '1';
