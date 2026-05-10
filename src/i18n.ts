import type { Theme } from './themes';

export type Language = 'en' | 'id';

export const LANGUAGES: Record<Language, { label: string; ariaLabel: string }> = {
  en: { label: 'EN', ariaLabel: 'Switch to English' },
  id: { label: 'ID', ariaLabel: 'Ganti ke Bahasa Indonesia' },
};

export const UI_COPY = {
  en: {
    hello: 'Hello!',
    introEyebrow: 'PORTFOLIO INTERFACE',
    introTitle: 'Andhika Prasetya Adi Nugroho',
    introSubtitle: 'Hydrographic & Geomatic Engineer',
    introDescription: 'This interactive portfolio presents Andhika\'s geospatial field experience, technical stack, leadership record, research thesis, and contact channels.',
    introEnter: 'Enter Portfolio',
    introSkip: "Don't show again",
    introLanguageLabel: 'Intro language',
    identityStatus: 'IDENT_STATUS: VERIFIED',
    systemReady: 'SYS_CMD: BOOT_COMPLETE',
    coreAdvantage: 'CORE_ADVANTAGE',
    equipmentStack: 'EQUIPMENT_STACK',
    closeDetails: 'CLOSE_DETAILS',
    open: 'OPEN',
    subjectIdentifier: 'SUBJECT_IDENTIFIER',
    authVerified: 'AUTH // ID_VERIFIED',
    academicRecord: 'Academic_Record',
    commChannels: 'Comm_Channels',
    workHistoryEyebrow: 'Primary Professional Records',
    workHistoryTitle: 'Work History',
    leadershipEyebrow: 'Organizational Contribution',
    leadershipTitle: 'Leadership',
    techStackEyebrow: 'Capabilities & Tools',
    techStackTitle: 'Tech Stack',
    fieldExpertise: 'Field_Expertise',
    systemTools: 'System_Tools',
    researchThesis: 'Research_Thesis',
    researchTitle: 'Spatial Information Systems for Disaster Mitigation',
    openSystem: 'Open System',
    contactEyebrow: 'Awaiting_Comm_Link',
    contactTitle: 'Get In Touch',
    downloadCv: 'Download CV Andhika',
    transmission: 'Transmission Stable // No Drop',
    modalCloseAria: 'Close details',
    soundOnAria: 'Mute interface sound',
    soundOffAria: 'Enable interface sound',
    strengthsOpenAria: 'Open core advantage details',
    strengthsCloseAria: 'Close core advantage details',
    switchThemeAria: (label: string) => `Switch to ${label} mode`,
    openNodeAria: (label: string) => `Open ${label} details`,
    nodes: {
      hydro: { bio: 'Sonar Origin', history: 'Sounding Dept', data: 'Wreck Data', contact: 'Comms Buoy' },
      gis: { bio: 'Root Node', history: 'Logic Layer', data: 'Geo Registry', contact: 'API Portal' },
      land: { bio: 'Station 001', history: 'Field Grid', data: 'Site Plan', contact: 'Heliport' },
      precision: { bio: 'Base Geoid', history: 'Prec Bench', data: 'Sat Link', contact: 'Ref Center' },
    } satisfies Record<Theme, Record<'bio' | 'history' | 'data' | 'contact', string>>,
    themes: {
      hydro: {
        subtext: 'Hydrographic Surveyor',
        strengths: {
          title: 'Adaptive Versatility',
          description: 'Mastery in bathymetric acquisition and sonar interpretation. Navigating complex underwater environments with fluid problem-solving and deep technical insight.',
          points: ['Sub-bottom Profiling', 'Multibeam Acquisition', 'Real-time Data Processing'],
          equipment: 'Kongsberg EM2040 / EdgeTech 4125',
        },
      },
      gis: {
        subtext: 'GIS Analyst & Modeler',
        strengths: {
          title: 'Analytical Depth',
          description: 'Architecting complex geospatial databases and topological models. Converting raw spatial data into strategic intelligence through layered logic.',
          points: ['Network Topology', 'Raster Analysis', 'Python Automation'],
          equipment: 'ArcGIS Pro / PostgreSQL-PostGIS',
        },
      },
      land: {
        subtext: 'Land Surveyor Specialist',
        strengths: {
          title: 'Grounded Reliability',
          description: 'Establishing geodetic control in the most demanding terrains. Precision execution through rigorous field procedures and engineering mastery.',
          points: ['Cadastral Mapping', 'Topographic Detail', 'Boundary Recovery'],
          equipment: 'Leica TS16 / Nikon Nivel',
        },
      },
      precision: {
        subtext: 'Geodetic Engineer',
        strengths: {
          title: 'Extreme Precision',
          description: 'Pushing the limits of measurement through satellite geodesy and high-frequency sensor fusion. Eliminating error through absolute mathematical rigor.',
          points: ['CORS Management', 'GNSS Post-Processing', 'Deformation Analysis'],
          equipment: 'Trimble R12i / RTK-DGPS',
        },
      },
    } satisfies Record<Theme, { subtext: string; strengths: { title: string; description: string; points: string[]; equipment: string } }>,
  },
  id: {
    hello: 'Halo!',
    introEyebrow: 'ANTARMUKA PORTOFOLIO',
    introTitle: 'Andhika Prasetya Adi Nugroho',
    introSubtitle: 'Insinyur Hidrografi & Geomatika',
    introDescription: 'Portofolio interaktif ini menampilkan pengalaman geospasial lapangan, keahlian teknis, rekam kepemimpinan, tugas akhir, dan kanal kontak Andhika.',
    introEnter: 'Masuk Portofolio',
    introSkip: 'Jangan tampilkan lagi',
    introLanguageLabel: 'Bahasa intro',
    identityStatus: 'STATUS_IDENT: TERVERIFIKASI',
    systemReady: 'SYS_CMD: SIAP_OPERASI',
    coreAdvantage: 'KEUNGGULAN_INTI',
    equipmentStack: 'PERANGKAT_UTAMA',
    closeDetails: 'TUTUP_DETAIL',
    open: 'BUKA',
    subjectIdentifier: 'IDENTITAS_SUBJEK',
    authVerified: 'AUTH // TERVERIFIKASI',
    academicRecord: 'Rekam_Akademik',
    commChannels: 'Kanal_Kontak',
    workHistoryEyebrow: 'Rekam Profesional Utama',
    workHistoryTitle: 'Pengalaman Kerja',
    leadershipEyebrow: 'Kontribusi Organisasi',
    leadershipTitle: 'Kepemimpinan',
    techStackEyebrow: 'Kapabilitas & Perangkat',
    techStackTitle: 'Keahlian Teknis',
    fieldExpertise: 'Keahlian_Lapangan',
    systemTools: 'Perangkat_Sistem',
    researchThesis: 'Tugas_Akhir',
    researchTitle: 'Sistem Informasi Spasial untuk Mitigasi Bencana',
    openSystem: 'Buka Sistem',
    contactEyebrow: 'Menunggu_Kanal_Kontak',
    contactTitle: 'Hubungi Saya',
    downloadCv: 'Unduh CV Andhika',
    transmission: 'Transmisi Stabil // Tanpa Gangguan',
    modalCloseAria: 'Tutup detail',
    soundOnAria: 'Matikan suara antarmuka',
    soundOffAria: 'Aktifkan suara antarmuka',
    strengthsOpenAria: 'Buka detail keunggulan inti',
    strengthsCloseAria: 'Tutup detail keunggulan inti',
    switchThemeAria: (label: string) => `Ganti ke mode ${label}`,
    openNodeAria: (label: string) => `Buka detail ${label}`,
    nodes: {
      hydro: { bio: 'Titik Sonar', history: 'Rekam Survei', data: 'Data Riset', contact: 'Pelampung Comms' },
      gis: { bio: 'Node Utama', history: 'Lapisan Logika', data: 'Registri Geo', contact: 'Portal API' },
      land: { bio: 'Stasiun 001', history: 'Grid Lapangan', data: 'Rencana Tapak', contact: 'Helipad' },
      precision: { bio: 'Geoid Dasar', history: 'Bench Presisi', data: 'Taut Satelit', contact: 'Pusat Referensi' },
    } satisfies Record<Theme, Record<'bio' | 'history' | 'data' | 'contact', string>>,
    themes: {
      hydro: {
        subtext: 'Surveyor Hidrografi',
        strengths: {
          title: 'Adaptif dan Serbaguna',
          description: 'Menguasai akuisisi batimetri dan interpretasi sonar. Mampu membaca lingkungan bawah air yang kompleks dengan pendekatan teknis yang tajam.',
          points: ['Sub-bottom Profiling', 'Akuisisi Multibeam', 'Pemrosesan Data Real-time'],
          equipment: 'Kongsberg EM2040 / EdgeTech 4125',
        },
      },
      gis: {
        subtext: 'Analis & Pemodel GIS',
        strengths: {
          title: 'Kedalaman Analitis',
          description: 'Membangun basis data geospasial dan model topologi untuk mengubah data spasial mentah menjadi informasi strategis.',
          points: ['Topologi Jaringan', 'Analisis Raster', 'Otomasi Python'],
          equipment: 'ArcGIS Pro / PostgreSQL-PostGIS',
        },
      },
      land: {
        subtext: 'Spesialis Survei Terestris',
        strengths: {
          title: 'Andal di Lapangan',
          description: 'Membangun kontrol geodetik pada medan menantang dengan prosedur lapangan yang rapi dan ketelitian pengukuran.',
          points: ['Pemetaan Kadastral', 'Detail Topografi', 'Rekonstruksi Batas'],
          equipment: 'Leica TS16 / Nikon Nivel',
        },
      },
      precision: {
        subtext: 'Insinyur Geodesi',
        strengths: {
          title: 'Presisi Tinggi',
          description: 'Mengoptimalkan pengukuran melalui geodesi satelit dan integrasi sensor untuk menekan galat secara sistematis.',
          points: ['Manajemen CORS', 'Post-processing GNSS', 'Analisis Deformasi'],
          equipment: 'Trimble R12i / RTK-DGPS',
        },
      },
    } satisfies Record<Theme, { subtext: string; strengths: { title: string; description: string; points: string[]; equipment: string } }>,
  },
} as const;

export const CV_CONTENT = {
  en: {
    profile: {
      role: 'Hydrographic & Geomatic Engineer',
      summary: 'Final-year student in Geodesy and Geomatics Engineering at ITB with a strong interest in hydrographic and offshore surveying. Experienced in field-based surveys, GNSS RTK, UAV mapping, and geospatial data processing. Demonstrates solid leadership experience and strong HSSE awareness.',
    },
    education: [
      {
        institution: 'Institut Teknologi Bandung (ITB)',
        degree: 'Bachelor of Geodesy and Geomatics Engineering',
        period: '2022 - 2026 (Expected)',
        thesis: 'Developing a web-based geospatial information system to estimate state financial losses from crop productivity reduction due to floods and droughts.',
        specialization: 'Hydrography (Offshore Positioning, Nautical Sciences, Met-Ocean Analysis)',
      },
    ],
    experience: [
      {
        company: 'Institut Teknologi Bandung (ITB)',
        role: 'Geospatial Hazard Recovery Assistant for Sumatra',
        period: 'February 2026 - Present',
        points: [
          'Serve as a Geospatial Assistant at ITB, specializing in spatial data processing and analysis for disaster mitigation and recovery mapping.',
          'Execute advanced processing of orthophotos, Digital Elevation Models (DEMs), and satellite imagery using ArcGIS and QGIS to ensure data accuracy.',
          'Leverage Google Earth Engine for large-scale satellite data analysis and environmental monitoring to support regional disaster management initiatives.',
        ],
      },
      {
        company: 'Institut Teknologi Bandung (ITB)',
        role: 'Spatial Database Assistant at Geospatial Information Laboratory',
        period: 'September 2025 - December 2025',
        points: [
          'Served as a teaching assistant for the Spatial Database course, supporting lectures and hands-on practical sessions.',
          'Developed and prepared practical modules using Microsoft Access, PostgreSQL, and PostGIS.',
          'Provided technical guidance and assistance to students in spatial database management and geospatial data processing.',
        ],
      },
      {
        company: 'PT Pertamina Hulu Energi (PHE)',
        role: 'Upstream Innovation Geomatics - Internship',
        period: 'July 2025 - August 2025',
        points: [
          'Conducted underground pipeline detection and positioning for a 24-inch pipeline using GNSS RTK and magnetometer in the operational area of Pertamina EP Field XX, West Java.',
          'Performed ground-based line surveys covering approximately 15 km and acquired aerial and thermal imagery using UAVs to support basemap development and pipeline route visualization.',
          'Processed and analyzed survey and spatial data using Agisoft Metashape, Emlid Studio, ArcMap, and Trimble Business Center (TBC).',
        ],
      },
      {
        company: 'Institut Teknologi Bandung (ITB)',
        role: 'Assistant Lecturer of Geospatial Expedition',
        period: 'September 2024 - November 2024',
        points: [
          'Prepared Job Safety Analysis (JSA) and developed STOP Cards to ensure compliance with Standard Operating Procedures (SOP) during expedition activities.',
          'Conducted orienteering training and provided field guidance to students.',
          'Ensured the implementation of Health, Safety, Security, and Environment (HSSE) standards throughout Geospatial Expedition field activities.',
        ],
      },
      {
        company: 'PT Perkebunan Nusantara I Regional 2 (Ex. PTPN VIII)',
        role: 'Administration and Mapping Sub Division - Internship',
        period: 'July 2024 - August 2024',
        points: [
          'Developed a geospatial database for plantation areas of PTPN I Regional 2.',
          'Digitized plantation maps based on land parcel data.',
          'Conducted field surveys and mapping activities across plantation areas.',
        ],
      },
    ],
    skills: {
      technical: ['Land Surveying', 'Hydrographic Surveying', 'HSSE Management', 'Spatial Data Management', 'GNSS RTK Operations', 'UAV Mapping', 'Google Earth Engine', 'Bathymetry Data Processing'],
      tools: ['TBC', 'Emlid Studio', 'Agisoft Metashape', 'ArcMap/ArcGIS', 'QGIS', 'PostgresSQL', 'PostGIS', 'Microsoft Access'],
    },
    organizations: [
      {
        company: 'Ikatan Mahasiswa Geodesi ITB (IMG-ITB)',
        role: 'Chairman',
        period: 'May 2025 - February 2026',
        points: [
          'Served as Chairman of IMG-ITB, leading 6 divisions and 2 semi-autonomous bodies (BSO).',
          'Coordinated organizational planning and execution to ensure effective cross-division collaboration.',
          "Implemented programs focused on members' self-development and professional growth.",
        ],
      },
      {
        company: 'Field Camp ITB 2025',
        role: 'Head of Health, Safety, Security, and Environment (HSSE) Division',
        period: 'February 2025 - September 2025',
        points: [
          'Led the HSSE Division for a 9-day field camp involving 122 participants in Desa Santosa, Bandung Regency, ensuring the implementation of safety, security, and environmental protocols.',
          'Developed and enforced HSSE procedures, conducted daily safety briefings, and monitored field operations to minimize risks and maintain compliance throughout all field activities.',
        ],
      },
      {
        company: 'Parade Wisuda Oktober ITB 2024',
        role: 'Field Coordinator',
        period: 'September 2024 - February 2025',
        points: [
          'Created a field plan for a procession for 44 Student Association Departments with a mass of approximately 12,000 people.',
          'Implemented field planning according to the planned route and time.',
          'Coordinated with the Field Coordinators of the 44 Student Association Departments.',
        ],
      },
    ],
  },
  id: {
    profile: {
      role: 'Insinyur Hidrografi & Geomatika',
      summary: 'Mahasiswa tingkat akhir Teknik Geodesi dan Geomatika ITB dengan minat kuat pada survei hidrografi dan offshore. Berpengalaman dalam survei lapangan, GNSS RTK, pemetaan UAV, dan pemrosesan data geospasial. Memiliki pengalaman kepemimpinan yang solid serta kesadaran HSSE yang kuat.',
    },
    education: [
      {
        institution: 'Institut Teknologi Bandung (ITB)',
        degree: 'Sarjana Teknik Geodesi dan Geomatika',
        period: '2022 - 2026 (Perkiraan)',
        thesis: 'Pengembangan sistem informasi geospasial berbasis web untuk mengestimasi kerugian keuangan negara akibat penurunan produktivitas tanaman karena banjir dan kekeringan.',
        specialization: 'Hidrografi (Offshore Positioning, Nautical Sciences, Analisis Met-Ocean)',
      },
    ],
    experience: [
      {
        company: 'Institut Teknologi Bandung (ITB)',
        role: 'Asisten Geospasial Hazard Recovery untuk Sumatra',
        period: 'Februari 2026 - Sekarang',
        points: [
          'Berperan sebagai Asisten Geospasial ITB dengan fokus pada pemrosesan dan analisis data spasial untuk mitigasi bencana dan pemetaan pemulihan.',
          'Melakukan pemrosesan orthophoto, Digital Elevation Model (DEM), dan citra satelit menggunakan ArcGIS dan QGIS untuk menjaga akurasi data.',
          'Memanfaatkan Google Earth Engine untuk analisis citra satelit skala besar dan pemantauan lingkungan dalam mendukung pengelolaan bencana regional.',
        ],
      },
      {
        company: 'Institut Teknologi Bandung (ITB)',
        role: 'Asisten Basis Data Spasial di Laboratorium Informasi Geospasial',
        period: 'September 2025 - Desember 2025',
        points: [
          'Menjadi asisten praktikum mata kuliah Basis Data Spasial, mendukung perkuliahan dan sesi praktikum.',
          'Mengembangkan dan menyiapkan modul praktikum menggunakan Microsoft Access, PostgreSQL, dan PostGIS.',
          'Memberikan arahan teknis kepada mahasiswa dalam pengelolaan basis data spasial dan pemrosesan data geospasial.',
        ],
      },
      {
        company: 'PT Pertamina Hulu Energi (PHE)',
        role: 'Upstream Innovation Geomatics - Magang',
        period: 'Juli 2025 - Agustus 2025',
        points: [
          'Melakukan deteksi dan penentuan posisi pipa bawah tanah berukuran 24 inci menggunakan GNSS RTK dan magnetometer di area operasi Pertamina EP Field XX, Jawa Barat.',
          'Melaksanakan survei jalur darat sekitar 15 km serta akuisisi citra udara dan termal menggunakan UAV untuk mendukung basemap dan visualisasi rute pipa.',
          'Memproses dan menganalisis data survei serta data spasial menggunakan Agisoft Metashape, Emlid Studio, ArcMap, dan Trimble Business Center (TBC).',
        ],
      },
      {
        company: 'Institut Teknologi Bandung (ITB)',
        role: 'Asisten Dosen Ekspedisi Geospasial',
        period: 'September 2024 - November 2024',
        points: [
          'Menyiapkan Job Safety Analysis (JSA) dan STOP Card untuk memastikan kepatuhan terhadap SOP selama kegiatan ekspedisi.',
          'Memberikan pelatihan orienteering dan pendampingan lapangan kepada mahasiswa.',
          'Memastikan penerapan standar Health, Safety, Security, and Environment (HSSE) selama seluruh kegiatan lapangan Ekspedisi Geospasial.',
        ],
      },
      {
        company: 'PT Perkebunan Nusantara I Regional 2 (Ex. PTPN VIII)',
        role: 'Administrasi dan Mapping Sub Division - Magang',
        period: 'Juli 2024 - Agustus 2024',
        points: [
          'Mengembangkan basis data geospasial untuk area perkebunan PTPN I Regional 2.',
          'Melakukan digitasi peta perkebunan berdasarkan data bidang tanah.',
          'Melaksanakan kegiatan survei dan pemetaan lapangan di area perkebunan.',
        ],
      },
    ],
    skills: {
      technical: ['Survei Terestris', 'Survei Hidrografi', 'Manajemen HSSE', 'Manajemen Data Spasial', 'Operasi GNSS RTK', 'Pemetaan UAV', 'Google Earth Engine', 'Pemrosesan Data Batimetri'],
      tools: ['TBC', 'Emlid Studio', 'Agisoft Metashape', 'ArcMap/ArcGIS', 'QGIS', 'PostgresSQL', 'PostGIS', 'Microsoft Access'],
    },
    organizations: [
      {
        company: 'Ikatan Mahasiswa Geodesi ITB (IMG-ITB)',
        role: 'Ketua Himpunan',
        period: 'Mei 2025 - Februari 2026',
        points: [
          'Menjabat sebagai Ketua IMG-ITB, memimpin 6 divisi dan 2 badan semi-otonom (BSO).',
          'Mengkoordinasikan perencanaan dan pelaksanaan program untuk memastikan kolaborasi lintas divisi berjalan efektif.',
          'Menginisiasi program yang berfokus pada pengembangan diri dan pertumbuhan profesional anggota.',
        ],
      },
      {
        company: 'Field Camp ITB 2025',
        role: 'Kepala Divisi Health, Safety, Security, and Environment (HSSE)',
        period: 'Februari 2025 - September 2025',
        points: [
          'Memimpin Divisi HSSE untuk field camp 9 hari dengan 122 peserta di Desa Santosa, Kabupaten Bandung, serta memastikan penerapan protokol keselamatan, keamanan, dan lingkungan.',
          'Menyusun dan menerapkan prosedur HSSE, melakukan briefing keselamatan harian, dan memantau operasi lapangan untuk meminimalkan risiko.',
        ],
      },
      {
        company: 'Parade Wisuda Oktober ITB 2024',
        role: 'Koordinator Lapangan',
        period: 'September 2024 - Februari 2025',
        points: [
          'Menyusun rencana lapangan untuk prosesi 44 himpunan mahasiswa jurusan dengan massa sekitar 12.000 orang.',
          'Mengimplementasikan rencana lapangan sesuai rute dan waktu yang telah ditetapkan.',
          'Berkoordinasi dengan koordinator lapangan dari 44 himpunan mahasiswa jurusan.',
        ],
      },
    ],
  },
} as const;
