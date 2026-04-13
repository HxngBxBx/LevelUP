/* =====================================================================
   📚 ไฟล์: js/structure.js
   หน้าที่: เก็บโครงสร้างแผนผังรายวิชา (Menu Structure) และโควต้าชุดข้อสอบ
   ===================================================================== */

console.log("🗺️ [START] โมดูลเริ่มทำงาน: structure.js (โครงสร้างหลักสูตรและบทเรียน)");

// --------------------------------------------------------------------------------
// 📚 1. โครงสร้างรายวิชา ระดับชั้น เทอม และบทเรียน (NEW_EXAM_STRUCTURE)
// --------------------------------------------------------------------------------
const NEW_EXAM_STRUCTURE = {
    // ==========================================
    // หมวดหมู่ที่ 1: คณิตศาสตร์พื้นฐาน
    // ==========================================
    "math_basic": {
        title: { th: "📚 คณิตศาสตร์พื้นฐาน", en: "📚 Basic Mathematics" },
        grades: {
            "p1": {
                title: { th: "คณิตศาสตร์พื้นฐาน ป.1", en: "Basic Math P.1" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 จำนวนนับ 1 ถึง 10 และ 0", en: "Unit 1: Numbers 1 to 10 and 0" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การบวกจำนวนสองจำนวนที่ผลบวกไม่เกิน 10", en: "Unit 2: Addition within 10" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 การลบจำนวนสองจำนวนที่ตัวตั้งไม่เกิน 10", en: "Unit 3: Subtraction within 10" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 จำนวนนับ 11 ถึง 20", en: "Unit 4: Numbers 11 to 20" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 การบวก การลบจำนวนนับไม่เกิน 20", en: "Unit 5: Addition and Subtraction within 20" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 6 แผนภูมิรูปภาพ", en: "Unit 6: Pictograms" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 การวัดน้ำหนัก", en: "Unit 7: Weight Measurement" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u8", name: { th: "บทที่ 8 การบอกตำแหน่งและอันดับที่", en: "Unit 8: Positions and Ordinals" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 9 รูปเรขาคณิต", en: "Unit 9: Geometric Shapes" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 10 จำนวนนับ 21 ถึง 100", en: "Unit 10: Numbers 21 to 100" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u11", name: { th: "บทที่ 11 การวัดความยาว", en: "Unit 11: Length Measurement" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u12", name: { th: "บทที่ 12 การบวกที่ผลบวกไม่เกิน 100", en: "Unit 12: Addition within 100" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u13", name: { th: "บทที่ 13 การลบจำนวนที่ตัวตั้งไม่เกิน 100", en: "Unit 13: Subtraction within 100" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u14", name: { th: "บทที่ 14 โจทย์ปัญหาการบวกและโจทย์ปัญหาการลบ", en: "Unit 14: Addition and Subtraction Word Problems" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p2": {
                title: { th: "คณิตศาสตร์พื้นฐาน ป.2", en: "Basic Math P.2" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 จำนวนนับไม่เกิน 1,000 และ 0", en: "Unit 1: Numbers up to 1,000 and 0" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การบวกและการลบจำนวนนับไม่เกิน 1,000", en: "Unit 2: Addition and Subtraction within 1,000" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 การวัดความยาว", en: "Unit 3: Length Measurement" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 การวัดน้ำหนัก", en: "Unit 4: Weight Measurement" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 การคูณ", en: "Unit 5: Multiplication" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u6", name: { th: "บทที่ 6 การหาร", en: "Unit 6: Division" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 เวลา", en: "Unit 7: Time" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 8 การวัดปริมาตร", en: "Unit 8: Volume Measurement" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 9 รูปเรขาคณิต", en: "Unit 9: Geometric Shapes" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 10 การบวก ลบ คูณ หารระคน", en: "Unit 10: Mixed Operations" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u11", name: { th: "บทที่ 11 แผนภูมิรูปภาพ", en: "Unit 11: Pictograms" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p3": {
                title: { th: "คณิตศาสตร์พื้นฐาน ป.3", en: "Basic Math P.3" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 จำนวนนับไม่เกิน 100,000", en: "Unit 1: Numbers up to 100,000" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การบวกและการลบจำนวนนับไม่เกิน 100,000", en: "Unit 2: Addition and Subtraction within 100,000" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 เวลา", en: "Unit 3: Time" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 รูปเรขาคณิต", en: "Unit 4: Geometric Shapes" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 แผนภูมิรูปภาพและตารางทางเดียว", en: "Unit 5: Pictograms and One-way Tables" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 6 เศษส่วน", en: "Unit 6: Fractions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 การคูณ", en: "Unit 7: Multiplication" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u8", name: { th: "บทที่ 8 การหาร", en: "Unit 8: Division" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 9 การวัดความยาว", en: "Unit 9: Length Measurement" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 10 การวัดน้ำหนัก", en: "Unit 10: Weight Measurement" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u11", name: { th: "บทที่ 11 การวัดปริมาตร", en: "Unit 11: Volume Measurement" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u12", name: { th: "บทที่ 12 เงินและบันทึกรายรับรายจ่าย", en: "Unit 12: Money and Income/Expense Records" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u13", name: { th: "บทที่ 13 การบวก ลบ คูณ หารระคน", en: "Unit 13: Mixed Operations" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p4": {
                title: { th: "คณิตศาสตร์พื้นฐาน ป.4", en: "Basic Math P.4" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 จำนวนนับที่มากกว่า 100,000", en: "Unit 1: Numbers greater than 100,000" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การบวกและการลบจำนวนนับที่มากกว่า 100,000", en: "Unit 2: Addition and Subtraction of numbers greater than 100,000" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 การคูณ การหาร", en: "Unit 3: Multiplication and Division" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 การบวก ลบ คูณ หารจำนวนนับ", en: "Unit 4: Mixed Operations" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 เวลา", en: "Unit 5: Time" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u6", name: { th: "บทที่ 6 เศษส่วน", en: "Unit 6: Fractions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 ทศนิยม", en: "Unit 7: Decimals" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 8 มุม", en: "Unit 8: Angles" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 9 รูปสี่เหลี่ยมมุมฉาก", en: "Unit 9: Rectangles" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 10 การนำเสนอข้อมูล", en: "Unit 10: Data Presentation" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p5": {
                title: { th: "คณิตศาสตร์พื้นฐาน ป.5", en: "Basic Math P.5" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 เศษส่วน", en: "Unit 1: Fractions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 ทศนิยม", en: "Unit 2: Decimals" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 การนำเสนอข้อมูล", en: "Unit 3: Data Presentation" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "บทที่ 4 บัญญัติไตรยางศ์", en: "Unit 4: Rule of Three" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 ร้อยละ", en: "Unit 5: Percentages" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 6 เส้นขนาน", en: "Unit 6: Parallel Lines" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 รูปสี่เหลี่ยม", en: "Unit 7: Quadrilaterals" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 8 ปริมาตรและความจุของทรงสี่เหลี่ยมมุมฉาก", en: "Unit 8: Volume and Capacity of Rectangular Prisms" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p6": {
                title: { th: "คณิตศาสตร์พื้นฐาน ป.6", en: "Basic Math P.6" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 ห.ร.ม. และ ค.ร.น.", en: "Unit 1: GCD and LCM" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 เศษส่วน", en: "Unit 2: Fractions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 ทศนิยม", en: "Unit 3: Decimals" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 ร้อยละและอัตราส่วน", en: "Unit 4: Percentages and Ratios" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 แบบรูป", en: "Unit 5: Patterns" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u6", name: { th: "บทที่ 6 รูปสามเหลี่ยม", en: "Unit 6: Triangles" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 รูปหลายเหลี่ยม", en: "Unit 7: Polygons" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 8 วงกลม", en: "Unit 8: Circles" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 9 รูปเรขาคณิตสามมิติ", en: "Unit 9: 3D Geometric Shapes" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 10 การนำเสนอข้อมูล", en: "Unit 10: Data Presentation" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m1": {
                title: { th: "คณิตศาสตร์พื้นฐาน ม.1", en: "Basic Math M.1" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 จำนวนเต็ม", en: "Unit 1: Integers" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การสร้างทางเรขาคณิต", en: "Unit 2: Geometric Constructions" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 เลขยกกำลัง", en: "Unit 3: Exponents" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 ทศนิยมและเศษส่วน", en: "Unit 4: Decimals and Fractions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 รูปเรขาคณิตสองมิติและสามมิติ", en: "Unit 5: 2D and 3D Geometric Shapes" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u6", name: { th: "บทที่ 1 สมการเชิงเส้นตัวแปรเดียว", en: "Unit 1: Linear Equations with One Variable" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 2 อัตราส่วน สัดส่วน และร้อยละ", en: "Unit 2: Ratios, Proportions, and Percentages" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 3 กราฟและความสัมพันธ์เชิงเส้น", en: "Unit 3: Graphs and Linear Relationships" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 4 สถิติ (1)", en: "Unit 4: Statistics (1)" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m2": {
                title: { th: "คณิตศาสตร์พื้นฐาน ม.2", en: "Basic Math M.2" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 ทฤษฎีบทพีทาโกรัส", en: "Unit 1: Pythagorean Theorem" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 ความรู้เบื้องต้นเกี่ยวกับจำนวนจริง", en: "Unit 2: Introduction to Real Numbers" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 ปริซึมและทรงกระบอก", en: "Unit 3: Prisms and Cylinders" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 การแปลงทางเรขาคณิต", en: "Unit 4: Geometric Transformations" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 สมบัติของเลขยกกำลัง", en: "Unit 5: Properties of Exponents" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 6 พหุนาม", en: "Unit 6: Polynomials" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u7", name: { th: "บทที่ 1 สถิติ (2)", en: "Unit 1: Statistics (2)" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 2 ความเท่ากันทุกประการ", en: "Unit 2: Congruence" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 3 เส้นขนาน", en: "Unit 3: Parallel Lines" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 4 การให้เหตุผลทางเรขาคณิต", en: "Unit 4: Geometric Reasoning" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u11", name: { th: "บทที่ 5 การแยกตัวประกอบของพหุนามดีกรีสอง", en: "Unit 5: Factoring Quadratic Polynomials" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m3": {
                title: { th: "คณิตศาสตร์พื้นฐาน ม.3", en: "Basic Math M.3" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 อสมการเชิงเส้นตัวแปรเดียว", en: "Unit 1: Linear Inequalities with One Variable" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การแยกตัวประกอบของพหุนามที่มีดีกรีสูงกว่าสอง", en: "Unit 2: Factoring Polynomials with Degree Higher Than Two" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 สมการกำลังสองตัวแปรเดียว", en: "Unit 3: Quadratic Equations with One Variable" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 ความคล้าย", en: "Unit 4: Similarity" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 กราฟของฟังก์ชันกำลังสอง", en: "Unit 5: Graphs of Quadratic Functions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 6 สถิติ (3)", en: "Unit 6: Statistics (3)" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u7", name: { th: "บทที่ 1 ระบบสมการเชิงเส้นสองตัวแปร", en: "Unit 1: Systems of Linear Equations with Two Variables" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 2 วงกลม", en: "Unit 2: Circles" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 3 พีระมิด กรวย และทรงกลม", en: "Unit 3: Pyramids, Cones, and Spheres" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 4 ความน่าจะเป็น", en: "Unit 4: Probability" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u11", name: { th: "บทที่ 5 อัตราส่วนตรีโกณมิติ", en: "Unit 5: Trigonometric Ratios" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m4": {
                title: { th: "คณิตศาสตร์พื้นฐาน ม.4", en: "Basic Math M.4" },
                terms: {
                    "t1": {
                        title: { th: "เนื้อหาตลอดปีการศึกษา (ไม่แยกเทอม)", en: "All Chapters (Full Year)" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 เซต", en: "Unit 1: Sets" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 ตรรกศาสตร์เบื้องต้น", en: "Unit 2: Basic Logic" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 หลักการนับเบื้องต้น", en: "Unit 3: Basic Principles of Counting" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 ความน่าจะเป็น", en: "Unit 4: Probability" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m5": {
                title: { th: "คณิตศาสตร์พื้นฐาน ม.5", en: "Basic Math M.5" },
                terms: {
                    "t1": {
                        title: { th: "เนื้อหาตลอดปีการศึกษา (ไม่แยกเทอม)", en: "All Chapters (Full Year)" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 เลขยกกำลัง", en: "Unit 1: Exponents" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 ฟังก์ชัน", en: "Unit 2: Functions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 ลำดับและอนุกรม", en: "Unit 3: Sequences and Series" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 ดอกเบี้ยและมูลค่าของเงิน", en: "Unit 4: Interest and Value of Money" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m6": {
                title: { th: "คณิตศาสตร์พื้นฐาน ม.6", en: "Basic Math M.6" },
                terms: {
                    "t1": {
                        title: { th: "เนื้อหาตลอดปีการศึกษา (ไม่แยกเทอม)", en: "All Chapters (Full Year)" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 ความหมายของสถิติศาสตร์และข้อมูล", en: "Unit 1: Meaning of Statistics and Data" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การวิเคราะห์และนำเสนอข้อมูลเชิงคุณภาพ", en: "Unit 2: Analysis and Presentation of Qualitative Data" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 การวิเคราะห์และนำเสนอข้อมูลเชิงปริมาณ", en: "Unit 3: Analysis and Presentation of Quantitative Data" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            }
        }
    },
    // ==========================================
    // หมวดหมู่ที่ 2: คณิตศาสตร์เพิ่มเติม
    // ==========================================
    "math_add": {
        title: { th: "📐 คณิตศาสตร์เพิ่มเติม", en: "📐 Additional Mathematics" },
        grades: {
            "m4": {
                title: { th: "คณิตศาสตร์เพิ่มเติม ม.4", en: "Additional Math M.4" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 เซต", en: "Unit 1: Sets" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 ตรรกศาสตร์", en: "Unit 2: Logic" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 จำนวนจริง", en: "Unit 3: Real Numbers" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "บทที่ 1 ความสัมพันธ์และฟังก์ชัน", en: "Unit 1: Relations and Functions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 2 ฟังก์ชันเอกซ์โพเนนเชียลและฟังก์ชันลอการิทึม", en: "Unit 2: Exponential and Logarithmic Functions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 3 เรขาคณิตวิเคราะห์และภาคตัดกรวย", en: "Unit 3: Analytic Geometry and Conic Sections" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m5": {
                title: { th: "คณิตศาสตร์เพิ่มเติม ม.5", en: "Additional Math M.5" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 ฟังก์ชันตรีโกณมิติ", en: "Unit 1: Trigonometric Functions" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 เมทริกซ์", en: "Unit 2: Matrices" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 เวกเตอร์", en: "Unit 3: Vectors" }, skill: { th: "การวัดและเรขาคณิต", en: "Measurement & Geometry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "บทที่ 1 จำนวนเชิงซ้อน", en: "Unit 1: Complex Numbers" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 2 หลักการนับเบื้องต้น", en: "Unit 2: Basic Principles of Counting" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 3 ความน่าจะเป็น", en: "Unit 3: Probability" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m6": {
                title: { th: "คณิตศาสตร์เพิ่มเติม ม.6", en: "Additional Math M.6" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 ลำดับและอนุกรม", en: "Unit 1: Sequences and Series" }, skill: { th: "จำนวนและพีชคณิต", en: "Numbers & Algebra" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 แคลคูลัสเบื้องต้น", en: "Unit 2: Introduction to Calculus" }, skill: { th: "แคลคูลัส", en: "Calculus" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u3", name: { th: "บทที่ 1 ความหมายของสถิติศาสตร์และข้อมูล", en: "Unit 1: Meaning of Statistics and Data" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 2 การวิเคราะห์และนำเสนอข้อมูลเชิงคุณภาพ", en: "Unit 2: Analysis and Presentation of Qualitative Data" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 3 การวิเคราะห์และนำเสนอข้อมูลเชิงปริมาณ", en: "Unit 3: Analysis and Presentation of Quantitative Data" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 4 ตัวแปรสุ่มและการแจกแจงความน่าจะเป็น", en: "Unit 4: Random Variables and Probability Distributions" }, skill: { th: "สถิติและความน่าจะเป็น", en: "Statistics and Probability" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            }
        }
    },
    // ==========================================
    // หมวดหมู่ที่ 3: วิทยาศาสตร์พื้นฐาน
    // ==========================================
    "sci_basic": {
        title: { th: "🔬 วิทยาศาสตร์พื้นฐาน", en: "🔬 Basic Science" },
        grades: {
            "p1": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ป.1", en: "Basic Science P.1" }, 
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 การเรียนรู้สิ่งต่าง ๆ รอบตัว<br>🔍 บทที่ 1 เรียนรู้แบบนักวิทยาศาสตร์", en: "Unit 1: Learning About Things Around Us<br>🔍 Chapter 1: Learning Like a Scientist" }, skill: { th: "ทักษะกระบวนการทางวิทยาศาสตร์", en: "Science Process Skills" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 ตัวเรา สัตว์ และพืชรอบตัวเรา<br>🦴 บทที่ 1 ร่างกายของเรา", en: "Unit 2: Ourselves, Animals, and Plants<br>🦴 Chapter 1: Our Body" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 2 ตัวเรา สัตว์ และพืชรอบตัวเรา<br>🌱 บทที่ 2 สัตว์และพืชรอบตัวเรา", en: "Unit 2: Ourselves, Animals, and Plants<br>🌱 Chapter 2: Animals and Plants Around Us" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "หน่วยที่ 3 สิ่งต่าง ๆ รอบตัวเรา<br>🧱 บทที่ 1 วัสดุรอบตัวเรา", en: "Unit 3: Things Around Us<br>🧱 Chapter 1: Materials Around Us" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "หน่วยที่ 3 สิ่งต่าง ๆ รอบตัวเรา<br>🔊 บทที่ 2 เสียงในชีวิตประจำวัน", en: "Unit 3: Things Around Us<br>🔊 Chapter 2: Sound in Daily Life" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "หน่วยที่ 4 โลกและท้องฟ้าของเรา<br>🪨 บทที่ 1 หิน", en: "Unit 4: Our Earth and Sky<br>🪨 Chapter 1: Rocks" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "หน่วยที่ 4 โลกและท้องฟ้าของเรา<br>⭐ บทที่ 2 ท้องฟ้าและดาว", en: "Unit 4: Our Earth and Sky<br>⭐ Chapter 2: Sky and Stars" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p2": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ป.2", en: "Basic Science P.2" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 การเรียนรู้สิ่งต่าง ๆ รอบตัว<br>🔍 บทที่ 1 เรียนรู้แบบนักวิทยาศาสตร์", en: "Unit 1: Learning Things Around Us<br>🔍 Chapter 1: Learning Like a Scientist" }, skill: { th: "ทักษะกระบวนการทางวิทยาศาสตร์", en: "Science Process Skills" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 วัสดุและการใช้ประโยชน์<br>🧽 บทที่ 1 สมบัติการดูดซับน้ำและการใช้ประโยชน์", en: "Unit 2: Materials and Uses<br>🧽 Chapter 1: Water Absorption Properties and Uses" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 3 แสงและสิ่งมีชีวิต<br>💡 บทที่ 1 แสง", en: "Unit 3: Light and Living Things<br>💡 Chapter 1: Light" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "หน่วยที่ 3 แสงและสิ่งมีชีวิต<br>🌱 บทที่ 2 สิ่งมีชีวิต", en: "Unit 3: Light and Living Things<br>🌱 Chapter 2: Living Things" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u5", name: { th: "หน่วยที่ 4 ดินรอบตัวเรา<br>🪨 บทที่ 1 รู้จักดิน", en: "Unit 4: Soil Around Us<br>🪨 Chapter 1: Getting to Know Soil" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "หน่วยที่ 5 สมบัติของวัสดุ<br>🔄 บทที่ 1 การนำวัสดุที่ใช้แล้วกลับมาใช้ใหม่", en: "Unit 5: Properties of Materials<br>🔄 Chapter 1: Recycling Used Materials" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p3": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ป.3", en: "Basic Science P.3" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 การเรียนรู้สิ่งต่าง ๆ รอบตัว<br>🔍 บทที่ 1 เรียนรู้แบบนักวิทยาศาสตร์", en: "Unit 1: Learning Things Around Us<br>🔍 Chapter 1: Learning Like a Scientist" }, skill: { th: "ทักษะกระบวนการทางวิทยาศาสตร์", en: "Science Process Skills" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 อากาศและชีวิตของสัตว์<br>☁️ บทที่ 1 อากาศและความสำคัญต่อสิ่งมีชีวิต", en: "Unit 2: Air and Animal Life<br>☁️ Chapter 1: Air and Its Importance to Living Things" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 2 อากาศและชีวิตของสัตว์<br>🐾 บทที่ 2 การดำรงชีวิตของสัตว์", en: "Unit 2: Air and Animal Life<br>🐾 Chapter 2: Animal Life and Survival" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "หน่วยที่ 3 การเปลี่ยนแปลงของวัตถุและวัสดุ<br>🔥 บทที่ 1 การทำให้วัตถุและวัสดุเปลี่ยนแปลง", en: "Unit 3: Changes in Objects and Materials<br>🔥 Chapter 1: Causing Changes in Objects and Materials" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "หน่วยที่ 4 แรงในชีวิตประจำวัน<br>🧲 บทที่ 1 แรงสัมผัสและแรงไม่สัมผัส", en: "Unit 4: Forces in Daily Life<br>🧲 Chapter 1: Contact and Non-contact Forces" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "หน่วยที่ 5 พลังงานกับชีวิต<br>☀️ บทที่ 1 ดวงอาทิตย์และปรากฏการณ์ของโลก", en: "Unit 5: Energy and Life<br>☀️ Chapter 1: The Sun and Earth's Phenomena" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p4": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ป.4", en: "Basic Science P.4" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 การเรียนรู้สิ่งต่าง ๆ รอบตัว<br>🔍 บทที่ 1 การสืบเสาะหาความรู้ทางวิทยาศาสตร์", en: "Unit 1: Learning Things Around Us<br>🔍 Chapter 1: Scientific Inquiry" }, skill: { th: "ทักษะกระบวนการทางวิทยาศาสตร์", en: "Science Process Skills" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 สิ่งมีชีวิต<br>🐾 บทที่ 1 สิ่งมีชีวิตรอบตัว", en: "Unit 2: Living Things<br>🐾 Chapter 1: Living Things Around Us" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 2 สิ่งมีชีวิต<br>🌸 บทที่ 2 ส่วนต่าง ๆ ของพืชดอก", en: "Unit 2: Living Things<br>🌸 Chapter 2: Parts of Flowering Plants" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "หน่วยที่ 3 แรงและพลังงาน<br>⚖️ บทที่ 1 มวลและน้ำหนัก", en: "Unit 3: Force and Energy<br>⚖️ Chapter 1: Mass and Weight" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "หน่วยที่ 3 แรงและพลังงาน<br>💡 บทที่ 2 แสงและการมองเห็น", en: "Unit 3: Force and Energy<br>💡 Chapter 2: Light and Vision" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "หน่วยที่ 4 วัสดุและสสาร<br>🧱 บทที่ 1 สมบัติทางกายภาพของวัสดุ", en: "Unit 4: Materials and Matter<br>🧱 Chapter 1: Physical Properties of Materials" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "หน่วยที่ 4 วัสดุและสสาร<br>🧊 บทที่ 2 สถานะของสสาร", en: "Unit 4: Materials and Matter<br>🧊 Chapter 2: States of Matter" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "หน่วยที่ 5 โลกและอวกาศ<br>🌕 บทที่ 1 ดวงจันทร์และระบบสุริยะ", en: "Unit 5: Earth and Space<br>🌕 Chapter 1: The Moon and Solar System" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p5": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ป.5", en: "Basic Science P.5" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 การเรียนรู้สิ่งต่าง ๆ รอบตัว<br>🔍 บทที่ 1 ทักษะกระบวนการทางวิทยาศาสตร์", en: "Unit 1: Learning Things Around Us<br>🔍 Chapter 1: Science Process Skills" }, skill: { th: "ทักษะกระบวนการทางวิทยาศาสตร์", en: "Science Process Skills" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 แรงและพลังงาน<br>🧲 บทที่ 1 แรงลัพธ์และแรงเสียดทาน", en: "Unit 2: Force and Energy<br>🧲 Chapter 1: Resultant Force and Friction" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 2 แรงและพลังงาน<br>🔊 บทที่ 2 เสียง", en: "Unit 2: Force and Energy<br>🔊 Chapter 2: Sound" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "หน่วยที่ 3 การเปลี่ยนแปลงของสาร<br>🧪 บทที่ 1 การเปลี่ยนแปลงทางกายภาพและทางเคมี", en: "Unit 3: Changes in Matter<br>🧪 Chapter 1: Physical and Chemical Changes" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u5", name: { th: "หน่วยที่ 4 วัฏจักร<br>💧 บทที่ 1 วัฏจักรน้ำ", en: "Unit 4: Cycles<br>💧 Chapter 1: Water Cycle" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "หน่วยที่ 4 วัฏจักร<br>⭐ บทที่ 2 วัฏจักรการปรากฏของกลุ่มดาว", en: "Unit 4: Cycles<br>⭐ Chapter 2: Constellation Cycles" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "หน่วยที่ 5 สิ่งมีชีวิต<br>🧬 บทที่ 1 ลักษณะทางพันธุกรรม", en: "Unit 5: Living Things<br>🧬 Chapter 1: Genetic Traits" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "หน่วยที่ 5 สิ่งมีชีวิต<br>🌳 บทที่ 2 สิ่งมีชีวิตกับสิ่งแวดล้อม", en: "Unit 5: Living Things<br>🌳 Chapter 2: Living Things and the Environment" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "p6": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ป.6", en: "Basic Science P.6" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 สารอาหารและระบบย่อยอาหาร<br>🥩 บทที่ 1 สารอาหารและระบบย่อยอาหาร", en: "Unit 1: Nutrients and Digestive System<br>🥩 Chapter 1: Nutrients and Digestive System" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 การแยกสารเนื้อผสม<br>⚗️ บทที่ 1 วิธีการแยกสารเนื้อผสมอย่างง่าย", en: "Unit 2: Separation of Mixtures<br>⚗️ Chapter 1: Simple Methods for Separating Mixtures" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 3 หินและซากดึกดำบรรพ์<br>🦕 บทที่ 1 หินและซากดึกดำบรรพ์", en: "Unit 3: Rocks and Fossils<br>🦕 Chapter 1: Rocks and Fossils" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "หน่วยที่ 4 ปรากฏการณ์ของโลกและภัยธรรมชาติ<br>🌬️ บทที่ 1 ลมบก ลมทะเล และมรสุม", en: "Unit 4: Earth Phenomena and Natural Disasters<br>🌬️ Chapter 1: Land Breezes, Sea Breezes, and Monsoons" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "หน่วยที่ 4 ปรากฏการณ์ของโลกและภัยธรรมชาติ<br>🌋 บทที่ 2 ภัยธรรมชาติ", en: "Unit 4: Earth Phenomena and Natural Disasters<br>🌋 Chapter 2: Natural Disasters" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "หน่วยที่ 5 เงา อุปราคา และเทคโนโลยีอวกาศ<br>🌘 บทที่ 1 เงาและอุปราคา", en: "Unit 5: Shadows, Eclipses, and Space Technology<br>🌘 Chapter 1: Shadows and Eclipses" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "หน่วยที่ 5 เงา อุปราคา และเทคโนโลยีอวกาศ<br>🚀 บทที่ 2 เทคโนโลยีอวกาศ", en: "Unit 5: Shadows, Eclipses, and Space Technology<br>🚀 Chapter 2: Space Technology" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "หน่วยที่ 6 แรงไฟฟ้าและพลังงานไฟฟ้า<br>⚡ บทที่ 1 แรงไฟฟ้าและวงจรไฟฟ้า", en: "Unit 6: Electrical Force and Energy<br>⚡ Chapter 1: Electrical Force and Circuits" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m1": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ม.1", en: "Basic Science M.1" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 เรียนรู้วิทยาศาสตร์อย่างไร<br>🔬 บทที่ 1 เรียนรู้วิทยาศาสตร์อย่างไร", en: "Unit 1: How to Learn Science<br>🔬 Chapter 1: How to Learn Science" }, skill: { th: "ทักษะกระบวนการทางวิทยาศาสตร์", en: "Science Process Skills" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 สารบริสุทธิ์<br>🧪 บทที่ 1 สมบัติของสารบริสุทธิ์", en: "Unit 2: Pure Substances<br>🧪 Chapter 1: Properties of Pure Substances" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 2 สารบริสุทธิ์<br>⚗️ บทที่ 2 การจำแนกและองค์ประกอบของสารบริสุทธิ์", en: "Unit 2: Pure Substances<br>⚗️ Chapter 2: Classification and Composition of Pure Substances" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "หน่วยที่ 3 หน่วยพื้นฐานของสิ่งมีชีวิต<br>🦠 บทที่ 1 เซลล์", en: "Unit 3: Basic Units of Life<br>🦠 Chapter 1: Cells" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "หน่วยที่ 4 การดำรงชีวิตของพืช<br>🌸 บทที่ 1 การสืบพันธุ์และการขยายพันธุ์พืชดอก", en: "Unit 4: Plant Life<br>🌸 Chapter 1: Reproduction and Propagation of Flowering Plants" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "หน่วยที่ 4 การดำรงชีวิตของพืช<br>☀️ บทที่ 2 การสังเคราะห์ด้วยแสง", en: "Unit 4: Plant Life<br>☀️ Chapter 2: Photosynthesis" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "หน่วยที่ 4 การดำรงชีวิตของพืช<br>💧 บทที่ 3 การลำเลียงน้ำ ธาตุอาหาร และอาหารของพืช", en: "Unit 4: Plant Life<br>💧 Chapter 3: Transport of Water, Nutrients, and Food in Plants" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u8", name: { th: "หน่วยที่ 5 พลังงานความร้อน<br>🌡️ บทที่ 1 ความร้อนกับการเปลี่ยนแปลงของสสาร", en: "Unit 5: Thermal Energy<br>🌡️ Chapter 1: Heat and Changes in Matter" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "หน่วยที่ 5 พลังงานความร้อน<br>🔥 บทที่ 2 การถ่ายโอนความร้อน", en: "Unit 5: Thermal Energy<br>🔥 Chapter 2: Heat Transfer" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "หน่วยที่ 6 กระบวนการเปลี่ยนแปลงลมฟ้าอากาศ<br>☁️ บทที่ 1 ลมฟ้าอากาศรอบตัว", en: "Unit 6: Weather and Climate Changes<br>☁️ Chapter 1: Weather Around Us" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u11", name: { th: "หน่วยที่ 6 กระบวนการเปลี่ยนแปลงลมฟ้าอากาศ<br>🌍 บทที่ 2 มนุษย์และการเปลี่ยนแปลงลมฟ้าอากาศ", en: "Unit 6: Weather and Climate Changes<br>🌍 Chapter 2: Humans and Climate Change" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m2": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ม.2", en: "Basic Science M.2" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 ธรรมชาติของวิทยาศาสตร์<br>🔬 บทที่ 1 ธรรมชาติของวิทยาศาสตร์", en: "Unit 1: Nature of Science<br>🔬 Chapter 1: Nature of Science" }, skill: { th: "ทักษะกระบวนการทางวิทยาศาสตร์", en: "Science Process Skills" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 สารละลาย<br>🧪 บทที่ 1 องค์ประกอบของสารละลายและปัจจัยที่มีผลต่อสภาพละลายได้", en: "Unit 2: Solutions<br>🧪 Chapter 1: Components of Solutions and Factors Affecting Solubility" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 2 สารละลาย<br>⚗️ บทที่ 2 ความเข้มข้นของสารละลาย", en: "Unit 2: Solutions<br>⚗️ Chapter 2: Concentration of Solutions" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "หน่วยที่ 3 ร่างกายมนุษย์<br>🫀 บทที่ 1 ระบบอวัยวะในร่างกายของเรา", en: "Unit 3: Human Body<br>🫀 Chapter 1: Our Body Systems" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "หน่วยที่ 4 การเคลื่อนที่และแรง<br>🏃 บทที่ 1 การเคลื่อนที่", en: "Unit 4: Motion and Forces<br>🏃 Chapter 1: Motion" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "หน่วยที่ 4 การเคลื่อนที่และแรง<br>🧲 บทที่ 2 แรงในชีวิตประจำวัน", en: "Unit 4: Motion and Forces<br>🧲 Chapter 2: Forces in Daily Life" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u7", name: { th: "หน่วยที่ 5 งานและพลังงาน<br>⚙️ บทที่ 1 งาน กำลัง และเครื่องกลอย่างง่าย", en: "Unit 5: Work and Energy<br>⚙️ Chapter 1: Work, Power, and Simple Machines" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "หน่วยที่ 5 งานและพลังงาน<br>🎢 บทที่ 2 พลังงานกลและกฎการอนุรักษ์พลังงาน", en: "Unit 5: Work and Energy<br>🎢 Chapter 2: Mechanical Energy and Conservation of Energy" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "หน่วยที่ 6 การแยกสาร<br>🧫 บทที่ 1 การแยกสารและการนำไปใช้", en: "Unit 6: Separation of Mixtures<br>🧫 Chapter 1: Separation of Mixtures and Applications" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "หน่วยที่ 7 โลกและการเปลี่ยนแปลง<br>🌍 บทที่ 1 ดินและน้ำ", en: "Unit 7: Earth and Its Changes<br>🌍 Chapter 1: Soil and Water" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u11", name: { th: "หน่วยที่ 7 โลกและการเปลี่ยนแปลง<br>🌋 บทที่ 2 ภัยพิบัติทางธรรมชาติ", en: "Unit 7: Earth and Its Changes<br>🌋 Chapter 2: Natural Disasters" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u12", name: { th: "หน่วยที่ 8 ทรัพยากรพลังงาน<br>⚡ บทที่ 1 แหล่งพลังงาน", en: "Unit 8: Energy Resources<br>⚡ Chapter 1: Energy Sources" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m3": {
                title: { th: "วิทยาศาสตร์พื้นฐาน ม.3", en: "Basic Science M.3" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "หน่วยที่ 1 วิทยาศาสตร์กับการแก้ปัญหา<br>💡 บทที่ 1 วิทยาศาสตร์กับการแก้ปัญหา", en: "Unit 1: Science and Problem Solving<br>💡 Chapter 1: Science and Problem Solving" }, skill: { th: "ทักษะกระบวนการทางวิทยาศาสตร์", en: "Science Process Skills" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "หน่วยที่ 2 พันธุศาสตร์<br>🧬 บทที่ 1 การถ่ายทอดลักษณะทางพันธุกรรม", en: "Unit 2: Genetics<br>🧬 Chapter 1: Genetic Inheritance" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "หน่วยที่ 3 คลื่นและแสง<br>🌊 บทที่ 1 คลื่น", en: "Unit 3: Waves and Light<br>🌊 Chapter 1: Waves" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "หน่วยที่ 3 คลื่นและแสง<br>☀️ บทที่ 2 แสง", en: "Unit 3: Waves and Light<br>☀️ Chapter 2: Light" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "หน่วยที่ 4 ระบบสุริยะของเรา<br>🪐 บทที่ 1 ปฏิสัมพันธ์ในระบบสุริยะ", en: "Unit 4: Our Solar System<br>🪐 Chapter 1: Interactions in the Solar System" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u6", name: { th: "หน่วยที่ 5 ปฏิกิริยาเคมีและวัสดุในชีวิตประจำวัน<br>🧪 บทที่ 1 ปฏิกิริยาเคมี", en: "Unit 5: Chemical Reactions and Materials in Daily Life<br>🧪 Chapter 1: Chemical Reactions" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "หน่วยที่ 5 ปฏิกิริยาเคมีและวัสดุในชีวิตประจำวัน<br>📦 บทที่ 2 วัสดุในชีวิตประจำวัน", en: "Unit 5: Chemical Reactions and Materials in Daily Life<br>📦 Chapter 2: Materials in Daily Life" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "หน่วยที่ 6 ไฟฟ้า<br>⚡ บทที่ 1 วงจรไฟฟ้าอย่างง่าย", en: "Unit 6: Electricity<br>⚡ Chapter 1: Simple Electrical Circuits" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "หน่วยที่ 6 ไฟฟ้า<br>🔌 บทที่ 2 ไฟฟ้าในชีวิตประจำวัน", en: "Unit 6: Electricity<br>🔌 Chapter 2: Electricity in Daily Life" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "หน่วยที่ 7 ระบบนิเวศและความหลากหลายทางชีวภาพ<br>🌿 บทที่ 1 ระบบนิเวศ", en: "Unit 7: Ecosystems and Biodiversity<br>🌿 Chapter 1: Ecosystems" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u11", name: { th: "หน่วยที่ 7 ระบบนิเวศและความหลากหลายทางชีวภาพ<br>🦋 บทที่ 2 ความหลากหลายทางชีวภาพ", en: "Unit 7: Ecosystems and Biodiversity<br>🦋 Chapter 2: Biodiversity" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m4": {
                title: { th: "วิทยาศาสตร์ชีวภาพ ม.4", en: "Biological Science M.4" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 การลำเลียงสารเข้าและออกจากเซลล์", en: "Chapter 1: Transport of Substances Into and Out of Cells" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การรักษาดุลยภาพของร่างกายมนุษย์", en: "Chapter 2: Homeostasis of the Human Body" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 การดำรงชีวิตของพืช", en: "Chapter 3: Plant Life" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "บทที่ 4 พันธุกรรมและวิวัฒนาการ", en: "Chapter 4: Genetics and Evolution" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 ชีวิตในสิ่งแวดล้อม", en: "Chapter 5: Life in the Environment" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m5": {
                title: { th: "วิทยาศาสตร์กายภาพ ม.5", en: "Physical Science M.5" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1 (พาร์ทเคมี)", en: "Semester 1 (Chemistry)" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 อากาศ", en: "Chapter 1: Air" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 น้ำ", en: "Chapter 2: Water" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 อาหาร", en: "Chapter 3: Food" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 พลังงาน", en: "Chapter 4: Energy" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2 (พาร์ทฟิสิกส์)", en: "Semester 2 (Physics)" },
                        units: [
                            { id: "u5", name: { th: "บทที่ 1 การเคลื่อนที่และแรง", en: "Chapter 1: Motion and Forces" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 2 แรงในธรรมชาติ", en: "Chapter 2: Fundamental Forces in Nature" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 3 พลังงาน", en: "Chapter 3: Energy" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 4 ปรากฏการณ์ของคลื่นกล เสียง แสงสี และคลื่นแม่เหล็กไฟฟ้า", en: "Chapter 4: Phenomena of Mechanical Waves, Sound, Light and Colors, and Electromagnetic Waves" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m6": {
                title: { th: "วิทยาศาสตร์โลก ดาราศาสตร์ และอวกาศ ม.6", en: "Earth, Astronomy, and Space Science M.6" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 เอกภพและกาแล็กซี", en: "Chapter 1: Universe and Galaxies" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 ดาวฤกษ์", en: "Chapter 2: Stars" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 ระบบสุริยะ", en: "Chapter 3: Solar System" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 4 เทคโนโลยีอวกาศและการประยุกต์ใช้", en: "Chapter 4: Space Technology and Applications" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u5", name: { th: "บทที่ 5 โครงสร้างโลก", en: "Chapter 5: Earth's Structure" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 6 การแปรสัณฐานของแผ่นธรณี", en: "Chapter 6: Plate Tectonics" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 ธรณีพิบัติภัย", en: "Chapter 7: Geohazards" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 8 ลมฟ้าอากาศและภูมิอากาศ", en: "Chapter 8: Weather and Climate" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 9 การเปลี่ยนแปลงภูมิอากาศของโลก", en: "Chapter 9: Global Climate Change" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 10 ข้อมูลสารสนเทศทางอุตุนิยมวิทยากับการใช้ประโยชน์", en: "Chapter 10: Meteorological Information and Applications" }, skill: { th: "โลก ดาราศาสตร์และอวกาศ", en: "Earth, Astronomy & Space" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            }
        }
    },
    // ==========================================
    // หมวดหมู่ที่ 4: ฟิสิกส์เพิ่มเติม
    // ==========================================
    "physics": {
        title: { th: "🔋 ฟิสิกส์", en: "🔋 Physics" },
        grades: {
            "m4": {
                title: { th: "ฟิสิกส์ ม.4", en: "Physics M.4" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 ธรรมชาติและพัฒนาการทางฟิสิกส์", en: "Chapter 1: Nature and Development of Physics" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 การเคลื่อนที่แนวตรง", en: "Chapter 2: Linear Motion" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 แรงและกฎการเคลื่อนที่", en: "Chapter 3: Force and Laws of Motion" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "บทที่ 4 สมดุลกล", en: "Chapter 4: Mechanical Equilibrium" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 งานและพลังงาน", en: "Chapter 5: Work and Energy" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 6 โมเมนตัมและการชน", en: "Chapter 6: Momentum and Collisions" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 การเคลื่อนที่แนวโค้ง", en: "Chapter 7: Curved Motion" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m5": {
                title: { th: "ฟิสิกส์ ม.5", en: "Physics M.5" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 8 การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย", en: "Chapter 8: Simple Harmonic Motion" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 9 คลื่น", en: "Chapter 9: Waves" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 10 แสงเชิงคลื่น", en: "Chapter 10: Wave Optics" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 11 แสงเชิงรังสี", en: "Chapter 11: Ray Optics" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u5", name: { th: "บทที่ 12 เสียง", en: "Chapter 12: Sound" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 13 ไฟฟ้าสถิต", en: "Chapter 13: Electrostatics" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 14 ไฟฟ้ากระแส", en: "Chapter 14: Current Electricity" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m6": {
                title: { th: "ฟิสิกส์ ม.6", en: "Physics M.6" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 15 แม่เหล็กและไฟฟ้า", en: "Chapter 15: Magnetism and Electricity" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 16 ความร้อนและแก๊ส", en: "Chapter 16: Heat and Gases" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 17 ของแข็งและของไหล", en: "Chapter 17: Solids and Fluids" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "บทที่ 18 คลื่นแม่เหล็กไฟฟ้า", en: "Chapter 18: Electromagnetic Waves" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 19 ฟิสิกส์อะตอม", en: "Chapter 19: Atomic Physics" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 20 ฟิสิกส์นิวเคลียร์และฟิสิกส์อนุภาค", en: "Chapter 20: Nuclear and Particle Physics" }, skill: { th: "ฟิสิกส์", en: "Physics" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            }
        }
    },
    // ==========================================
    // หมวดหมู่ที่ 5: เคมีเพิ่มเติม
    // ==========================================
    "chemistry": {
        title: { th: "🧪 เคมี", en: "🧪 Chemistry" },
        grades: {
            "m4": {
                title: { th: "เคมี ม.4", en: "Chemistry M.4" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "🥽 บทที่ 1 ความปลอดภัยและทักษะในปฏิบัติการเคมี", en: "🥽 Unit 1: Safety and Skills in Chemical Laboratory" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "⚛️ บทที่ 2 อะตอมและสมบัติของธาตุ", en: "⚛️ Unit 2: Atoms and Properties of Elements" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "🔗 บทที่ 3 พันธะเคมี", en: "🔗 Unit 3: Chemical Bonding" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "⚖️ บทที่ 4 โมลและสูตรเคมี", en: "⚖️ Unit 4: Mole and Chemical Formulas" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "💧 บทที่ 5 สารละลาย", en: "💧 Unit 5: Solutions" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "📊 บทที่ 6 ปริมาณสัมพันธ์", en: "📊 Unit 6: Stoichiometry" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m5": {
                title: { th: "เคมี ม.5", en: "Chemistry M.5" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 7 แก๊สและสมบัติของแก๊ส", en: "Chapter 7: Gases and Properties of Gases" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 8 อัตราการเกิดปฏิกิริยาเคมี", en: "Chapter 8: Chemical Reaction Rates" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 9 สมดุลเคมี", en: "Chapter 9: Chemical Equilibrium" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "บทที่ 10 กรด-เบส", en: "Chapter 10: Acids and Bases" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 11 เคมีไฟฟ้า", en: "Chapter 11: Electrochemistry" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m6": {
                title: { th: "เคมี ม.6", en: "Chemistry M.6" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 12 เคมีอินทรีย์", en: "Chapter 12: Organic Chemistry" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 13 พอลิเมอร์", en: "Chapter 13: Polymers" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u3", name: { th: "บทที่ 14 เคมีกับการแก้ปัญหา", en: "Chapter 14: Chemistry and Problem Solving" }, skill: { th: "เคมี", en: "Chemistry" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            }
        }
    },
    // ==========================================
    // หมวดหมู่ที่ 6: ชีววิทยาเพิ่มเติม
    // ==========================================
    "biology": {
        title: { th: "🧬 ชีววิทยา", en: "🧬 Biology" },
        grades: {
            "m4": {
                title: { th: "ชีววิทยา ม.4", en: "Biology M.4" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 1 การศึกษาชีววิทยา", en: "Unit 1: The Study of Biology" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 2 เคมีที่เป็นพื้นฐานของสิ่งมีชีวิต", en: "Unit 2: Chemical Basis of Life" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 3 เซลล์และการทำงานของเซลล์", en: "Unit 3: Cells and Cell Function" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u4", name: { th: "บทที่ 4 โครโมโซมและสารพันธุกรรม", en: "Unit 4: Chromosomes and Genetic Material" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 5 การถ่ายทอดลักษณะทางพันธุกรรม", en: "Unit 5: Genetic Inheritance" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "บทที่ 6 เทคโนโลยีทางดีเอ็นเอ", en: "Unit 6: DNA Technology" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 7 วิวัฒนาการ", en: "Unit 7: Evolution" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m5": {
                title: { th: "ชีววิทยา ม.5", en: "Biology M.5" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 8 การสืบพันธุ์ของพืชดอก", en: "Chapter 8: Reproduction of Flowering Plants" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 9 โครงสร้างและการเจริญเติบโตของพืชดอก", en: "Chapter 9: Structure and Growth of Flowering Plants" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 10 การลำเลียงของพืช", en: "Chapter 10: Plant Transport" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 11 การสังเคราะห์ด้วยแสง", en: "Chapter 11: Photosynthesis" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 12 การควบคุมการเจริญเติบโตและการตอบสนองของพืช", en: "Chapter 12: Growth Control and Plant Response" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u6", name: { th: "บทที่ 13 ระบบย่อยอาหาร", en: "Chapter 13: Digestive System" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 14 ระบบหายใจ", en: "Chapter 14: Respiratory System" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 15 ระบบหมุนเวียนเลือดและระบบน้ำเหลือง", en: "Chapter 15: Circulatory and Lymphatic Systems" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "บทที่ 16 ระบบภูมิคุ้มกัน", en: "Chapter 16: Immune System" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u10", name: { th: "บทที่ 17 ระบบขับถ่าย", en: "Chapter 17: Excretory System" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "m6": {
                title: { th: "ชีววิทยา ม.6", en: "Biology M.6" },
                terms: {
                    "t1": {
                        title: { th: "เทอม 1", en: "Semester 1" },
                        units: [
                            { id: "u1", name: { th: "บทที่ 18 ระบบประสาทและอวัยวะรับความรู้สึก", en: "Chapter 18: Nervous System and Sense Organs" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "บทที่ 19 การเคลื่อนที่ของสิ่งมีชีวิต", en: "Chapter 19: Movement of Living Things" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "บทที่ 20 ระบบต่อมไร้ท่อ", en: "Chapter 20: Endocrine System" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u4", name: { th: "บทที่ 21 ระบบสืบพันธุ์และการเจริญเติบโต", en: "Chapter 21: Reproductive System and Development" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "บทที่ 22 พฤติกรรมของสัตว์", en: "Chapter 22: Animal Behavior" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    },
                    "t2": {
                        title: { th: "เทอม 2", en: "Semester 2" },
                        units: [
                            { id: "u6", name: { th: "บทที่ 23 ความหลากหลายทางชีวภาพ", en: "Chapter 23: Biodiversity" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u7", name: { th: "บทที่ 24 ระบบนิเวศและประชากร", en: "Chapter 24: Ecosystems and Populations" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "บทที่ 25 มนุษย์กับความยั่งยืนของทรัพยากรธรรมชาติและสิ่งแวดล้อม", en: "Chapter 25: Humans and Natural Resource/Environmental Sustainability" }, skill: { th: "ชีววิทยา", en: "Biology" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            }
        }
    },
    // ==========================================
    // หมวดหมู่ที่ 7: วิทยาการคำนวณและการเขียนโปรแกรม
    // ==========================================
    "comp": {
        title: { th: "💻 วิทยาการคำนวณและการเขียนโปรแกรม", en: "💻 Computing Science & Programming" },
        grades: {
            "lv1": {
                title: { th: "ช่วงที่ 1: ระดับเริ่มต้น (Beginner)", en: "Phase 1: Beginner" },
                terms: {
                    "t1": {
                        title: { th: "เส้นทางนักพัฒนาหน้าใหม่", en: "Developer's First Steps" },
                        units: [
                            { id: "u1", name: { th: "🧠 บทที่ 1 แนวคิดเชิงคำนวณและตรรกะ", en: "🧠 Unit 1: Computational Thinking & Logic" }, skill: { th: "พื้นฐานและตรรกะการคิด", en: "Logic & Fundamentals" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "⚙️ บทที่ 2 อัลกอริทึมและการแก้ปัญหา", en: "⚙️ Unit 2: Algorithms & Problem Solving" }, skill: { th: "โครงสร้างข้อมูลและอัลกอริทึม", en: "Data Structures & Algorithms" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "⌨️ บทที่ 3 การเขียนโปรแกรมเบื้องต้น (Python)", en: "⌨️ Unit 3: Intro to Programming (Python)" }, skill: { th: "พื้นฐานและตรรกะการคิด", en: "Logic & Fundamentals" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "lv2": {
                title: { th: "ช่วงที่ 2: ระดับกลาง (Intermediate)", en: "Phase 2: Intermediate" },
                terms: {
                    "t1": {
                        title: { th: "การจัดการข้อมูลเชิงลึก", en: "Data Management & Analytics" },
                        units: [
                            { id: "u4", name: { th: "🗂️ บทที่ 4 การจัดการและโครงสร้างข้อมูลขั้นสูง", en: "🗂️ Unit 4: Advanced Data Structures" }, skill: { th: "โครงสร้างข้อมูลและอัลกอริทึม", en: "Data Structures & Algorithms" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "💾 บทที่ 5 ระบบฐานข้อมูลและการเรียกใช้ (SQL/NoSQL)", en: "💾 Unit 5: Database Systems (SQL/NoSQL)" }, skill: { th: "ระบบฐานข้อมูล", en: "Databases" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "📊 บทที่ 6 วิทยาการข้อมูล (Data Science)", en: "📊 Unit 6: Data Science & Visualization" }, skill: { th: "ระบบฐานข้อมูล", en: "Databases" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "lv3": {
                title: { th: "ช่วงที่ 3: ระดับสูง (Advanced)", en: "Phase 3: Advanced" },
                terms: {
                    "t1": {
                        title: { th: "การประยุกต์ใช้และเทคโนโลยีอนาคต", en: "Applications & Future Tech" },
                        units: [
                            { id: "u7", name: { th: "🌐 บทที่ 7 การพัฒนาแอปพลิเคชัน (Web/App Dev)", en: "🌐 Unit 7: Application Development" }, skill: { th: "การพัฒนาส่วนหน้าจอและหลังบ้าน", en: "Frontend & Backend" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "🤖 บทที่ 8 ปัญญาประดิษฐ์ (AI & Machine Learning)", en: "🤖 Unit 8: AI & Machine Learning" }, skill: { th: "ปัญญาประดิษฐ์และการประยุกต์ใช้", en: "AI & Modern Tech" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "🛡️ บทที่ 9 พลเมืองดิจิทัลและความปลอดภัยไซเบอร์", en: "🛡️ Unit 9: Digital Citizenship & Cyber Security" }, skill: { th: "ปัญญาประดิษฐ์และการประยุกต์ใช้", en: "AI & Modern Tech" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            }
        }
    },
    // ==========================================
    // หมวดหมู่ที่ 8: จิตวิทยา
    // ==========================================
    "psycho": {
        title: { th: "🧠 จิตวิทยา", en: "🧠 Psychology" },
        grades: {
            "lv1": {
                title: { th: "ช่วงที่ 1: ระดับเริ่มต้น (Beginner)", en: "Phase 1: Beginner" },
                terms: {
                    "t1": {
                        title: { th: "เข้าใจตัวเองและสมอง", en: "Understanding Yourself & The Brain" },
                        units: [
                            { id: "u1", name: { th: "🌌 บทที่ 1 ประตูสู่จิตวิทยาและสมองมหัศจรรย์", en: "🌌 Unit 1: Gateway to Psychology & The Amazing Brain" }, skill: { th: "สมองและการรับรู้", en: "Brain & Perception" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u2", name: { th: "💡 บทที่ 2 ความจำและการเรียนรู้สไตล์แฮกเกอร์สมอง", en: "💡 Unit 2: Memory & Brain-Hacker Learning" }, skill: { th: "การคิดและการเรียนรู้", en: "Cognition & Learning" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u3", name: { th: "❤️ บทที่ 3 ฉลาดทางอารมณ์ (EQ) และการจัดการความรู้สึก", en: "❤️ Unit 3: Emotional Intelligence (EQ) & Feeling Management" }, skill: { th: "อารมณ์และสุขภาพจิต", en: "Emotions & Mental Health" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "lv2": {
                title: { th: "ช่วงที่ 2: ระดับกลาง (Intermediate)", en: "Phase 2: Intermediate" },
                terms: {
                    "t1": {
                        title: { th: "เติบโตและอยู่ร่วมกับผู้อื่น", en: "Growing & Coexisting" },
                        units: [
                            { id: "u4", name: { th: "🔍 บทที่ 4 ฉันคือใคร? (การค้นหาตัวตนและบุคลิกภาพ)", en: "🔍 Unit 4: Who Am I? (Identity & Personality)" }, skill: { th: "พัฒนาการและตัวตน", en: "Development & Identity" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u5", name: { th: "🤝 บทที่ 5 จิตวิทยาสังคม (อิทธิพลของกลุ่มและเพื่อน)", en: "🤝 Unit 5: Social Psychology (Peer & Group Influence)" }, skill: { th: "สังคมและคนรอบข้าง", en: "Social & Relationships" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u6", name: { th: "🤔 บทที่ 6 กับดักความคิด (Cognitive Biases) และการตัดสินใจ", en: "🤔 Unit 6: Cognitive Biases & Decision Making" }, skill: { th: "การคิดและการเรียนรู้", en: "Cognition & Learning" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            },
            "lv3": {
                title: { th: "ช่วงที่ 3: ระดับสูง (Advanced)", en: "Phase 3: Advanced" },
                terms: {
                    "t1": {
                        title: { th: "สุขภาพจิตและการประยุกต์ใช้", en: "Mental Health & Applications" },
                        units: [
                            { id: "u7", name: { th: "🩹 บทที่ 7 ความเครียด วิตกกังวล และการปฐมพยาบาลทางใจ", en: "🩹 Unit 7: Stress, Anxiety & Psychological First Aid" }, skill: { th: "อารมณ์และสุขภาพจิต", en: "Emotions & Mental Health" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u8", name: { th: "🗣️ บทที่ 8 จิตวิทยาการสื่อสารและความสัมพันธ์", en: "🗣️ Unit 8: Psychology of Communication & Relationships" }, skill: { th: "สังคมและคนรอบข้าง", en: "Social & Relationships" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } },
                            { id: "u9", name: { th: "🌱 บทที่ 9 จิตวิทยาพฤติกรรมและการสร้างนิสัย", en: "🌱 Unit 9: Behavioral Psychology & Habit Building" }, skill: { th: "พัฒนาการและตัวตน", en: "Development & Identity" }, maxSets: { easy: 5, medium: 5, hard: 5, extreme: 5 } }
                        ]
                    }
                }
            }
        }
    }
};

// --------------------------------------------------------------------------------
// 🗂️ 2. ฐานข้อมูลข้อสอบเริ่มต้น (Default Server Exams)
// เคลียร์ทิ้งให้เป็น Array ว่างเปล่า เพื่อรองรับระบบโหลดไดนามิกตามโครงสร้างใหม่
// --------------------------------------------------------------------------------
const defaultServerExams = [];

console.log("✅ [SUCCESS] structure.js โหลดเสร็จสมบูรณ์!");

/* =====================================================================
   สิ้นสุดไฟล์ structure.js
   ===================================================================== */