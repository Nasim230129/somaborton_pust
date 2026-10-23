// Verified institutional structure for Pabna University of Science & Technology (PUST)
// 5 Faculties & 21 Academic Departments

const FACULTIES = [
  {
    id: 1,
    slug: 'engineering-technology',
    name: 'Faculty of Engineering & Technology',
    shortName: 'Engineering & Technology',
    bengali: 'প্রকৌশল ও প্রযুক্তি অনুষদ',
    description: 'Premier engineering faculty driving innovation in computer science, electronics, civil engineering, architecture, and planning.',
    icon: '⚙️',
    coverImage: '/assets/WhatsApp_Image_2026-09-15_at_3.15.06_PM-CPUs16yN.jpeg',
    isActive: true,
  },
  {
    id: 2,
    slug: 'science',
    name: 'Faculty of Science',
    shortName: 'Science',
    bengali: 'বিজ্ঞান অনুষদ',
    description: 'Frontier scientific research in physical sciences, pure mathematics, chemistry, pharmacy, and statistics & data science.',
    icon: '🔬',
    coverImage: '/assets/WhatsApp_Image_2026-09-15_at_3.15.06_PM__1_-DcD11DjP.jpeg',
    isActive: true,
  },
  {
    id: 3,
    slug: 'business-studies',
    name: 'Faculty of Business Studies',
    shortName: 'Business Studies',
    bengali: 'ব্যবসায় শিক্ষা অনুষদ',
    description: 'Developing ethical business leaders, corporate strategists, entrepreneurs, and hospitality management professionals.',
    icon: '📈',
    coverImage: '/assets/WhatsApp_Image_2026-09-15_at_3.15.04_PM__1_-MyA59s-v.jpeg',
    isActive: true,
  },
  {
    id: 4,
    slug: 'humanities-social-science',
    name: 'Faculty of Humanities & Social Science',
    shortName: 'Humanities & Social Science',
    bengali: 'মানবিক ও সামাজিক বিজ্ঞান অনুষদ',
    description: 'Nurturing critical thinking, socio-economic policy, language, literature, social work, and historical studies.',
    icon: '📚',
    coverImage: '/assets/WhatsApp_Image_2026-09-15_at_3.15.05_PM__2_-0fp2ZTdb.jpeg',
    isActive: true,
  },
  {
    id: 5,
    slug: 'life-earth-science',
    name: 'Faculty of Life & Earth Science',
    shortName: 'Life & Earth Science',
    bengali: 'জীব ও ভূ-বিজ্ঞান অনুষদ',
    description: 'Environmental monitoring, geographical analysis, ecology, climate resilience, and sustainable development.',
    icon: '🌱',
    coverImage: '/assets/WhatsApp_Image_2026-09-15_at_3.15.05_PM__1_-Ce5e4mLS.jpeg',
    isActive: true,
  },
];

// Helper to generate the 18 active batches for any department
// PUST was established in 2008.
// 1st batch admitted 2008-2009 session, 18th batch currently running (2025-2026 session).
function generateDepartmentBatches(deptId, deptCode, estYear = 2008) {
  const batches = [];
  const baseStart = estYear;
  for (let b = 1; b <= 18; b++) {
    const startYr = baseStart + (b - 1);
    const endYr = startYr + 4;
    const session = `${startYr}-${startYr + 1}`;
    batches.push({
      id: deptId * 100 + b,
      batchNumber: b,
      label: `Batch ${b}`,
      session,
      admissionYear: startYr,
      graduationYear: endYr,
      departmentId: deptId,
      deptCode,
      status: b >= 15 ? 'active' : 'graduated',
      isActive: true,
    });
  }
  return batches;
}

module.exports = {
  FACULTIES,
  generateDepartmentBatches,
};
