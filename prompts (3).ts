export const medicalAdmissibilityExtractionPrompt = `Extract medical admissibility information from this document. Look for:
- Medical diagnosis or condition statements
- Doctor's notes, clinical observations, or medical findings
- Medical admissibility check reports
- Clinical assessment sections
- Physician notes or remarks

Extract the following information as a SINGLE object:
- diagnosis: ALL medical diagnoses or conditions identified in the document, combined together as a comma-separated list. This includes specific diseases, conditions, medical findings, or nature of illness mentioned in the admissibility report. Look for sections labeled "Diagnosis", "Condition", "Medical Finding", "Nature of Illness", or similar terms. If multiple diagnoses are present, combine them all into a single string separated by commas.
- lineOfTreatment: The line of treatment or surgical/medical procedure that was performed or planned. This is WHAT WAS DONE (the procedure), NOT the diagnosis (the condition). Look for sections labeled "Line of Treatment", "Procedure", "Operation", "Surgery", "Treatment", "Management", "Operative Notes", or similar. Examples: "Phacoemulsification with Foldable IOL Implantation", "Laparoscopic Cholecystectomy", "Conservative Management with IV Antibiotics", "PTCA with Stenting". If multiple procedures, combine as comma-separated. Return null if not found.
- icdCode1: The MOST SPECIFIC ICD-10-CM code for the primary diagnosis. This is the single most important field — extract directly from the document if printed, otherwise derive from the diagnosis text. Always go as specific as possible: include eye laterality (right/left/bilateral), type, and sub-type. Examples: "Nuclear cataract right eye" → "H25.11", "Nuclear cataract left eye" → "H25.12", "Appendicitis with abscess" → "K35.2", "Acute cholecystitis" → "K81.0", "Type 2 diabetes with diabetic cataract" → "E11.36". ALWAYS return a value — never return null. The system will automatically derive all 7 hierarchy levels (L1 broad category → L7 most specific) from this single code, so accuracy here is critical.
- icdCode2: ICD-10 code for the secondary diagnosis or comorbidity if one is explicitly mentioned in the document (e.g. hypertension co-existing with cataract → "I10"). Return null if there is truly only one diagnosis.
- icdCode3: ICD-10 code for a third condition or significant finding if present. Return null if not applicable.
- presentingComplaint: A brief 1-2 sentence clinical summary of the patient's condition based on all information available in the document — diagnosis, symptoms, doctor notes, and clinical findings. This should read like a doctor's summary of why the patient was admitted. Example: "Patient presents with left eye cataract with diminution of vision for 1 month, admitted for cataract surgery with monofocal IOL implantation." Always return a value — synthesize from the document even if no explicit complaint section exists.
- doctorNotes: Clinical notes, observations, or remarks written by the doctor — this includes both handwritten and printed doctor notes. Look for sections labeled "Doctor's Notes", "Clinical Notes", "Physician Remarks", "Observations", "Remarks", "Comments", "History", "Chief Complaints", "Clinical Summary", "Discharge Summary Notes", or similar. Include free-form clinical notes, observations, treatment remarks, and physician comments. DO NOT include the formal diagnosis (e.g. "Diagnosis: Cataract") or structured lab values — those belong in the diagnosis field. Combine all notes into a single string separated by double newlines (\\n\\n). If no doctor notes or clinical remarks are found anywhere in the document, leave this field empty.
- doctorNotesPageNumber: The PDF page index (1-based) where the doctor's notes appear. ⚠️ CRITICAL PAGE NUMBER INSTRUCTIONS ⚠️:
  * You must count pages from the BEGINNING of the PDF document (page 1 = first page, page 2 = second page, etc.)
  * DO NOT use any page numbers printed on the document pages - these may be different from the actual PDF page index
  * Find the page that contains the doctor's notes (look for sections labeled "Doctor's Notes", "Clinical Notes", "Remarks", "Observations", or similar)
  * The pageNumber is the physical PDF page where the doctor's notes appear
  * Scan through the PDF systematically from page 1 onwards until you find the doctor's notes
  * Record the number of the page where the doctor's notes are located (e.g., if the doctor's notes appear on what is physically page 3 of the PDF, doctorNotesPageNumber = 3)
  * If doctor's notes are not found or span multiple pages, use the first page where they appear
- conditionTests: ONLY for Cataract diagnosis. If cataract (or a close synonym) is present in the PDF, look for A-scan report data:
  - Cataract (A-scan): Look for A-scan report which typically contains:
    - Axial Length (Axl.) measurements for both eyes (RE and LE)
    - K1 and K2 (corneal curvature) measurements
    - Anisometropia (Anis.) measurements
    - Look for sections labeled "Ascan", "A-scan", "Axial Length", or similar
    - Look for measurements in formats like "Axl. 23.80", "K₁ 42.30", "K₂ 43.35", "Anis. 80", etc.

For Cataract condition ONLY (single test entry):
- condition: "Cataract (A-scan)"
- matchedDiagnosis: the exact diagnosis text that triggered the match (e.g., "cataract", "cataract surgery", etc.)
- pageNumber: The PDF page index (1-based) where the A-scan report for cataract is located. ⚠️ CRITICAL PAGE NUMBER INSTRUCTIONS ⚠️:
  * You must count pages from the BEGINNING of the PDF document (page 1 = first page, page 2 = second page, etc.)
  * DO NOT use any page numbers printed on the document pages - these may be different from the actual PDF page index
  * Find the page that contains the A-scan report data for cataract (look for sections labeled "A-scan", "Ascan", "Axial Length", or containing measurements like "Axl.", "K1", "K2", "Anis.")
  * The pageNumber is the physical PDF page where the A-scan measurements appear
  * Scan through the PDF systematically from page 1 onwards until you find the A-scan report with cataract data
  * Record the number of the page where the A-scan report is located (e.g., if the A-scan report appears on what is physically page 5 of the PDF, pageNumber = 5)
- testName: Use exact name: "A-scan"
- reportValue: "Yes" if A-scan report is found in the PDF, "No" if not found
- numericValue: leave null
- unit: leave empty string ""
- status: "expected" if A-scan is found (reportValue = "Yes"), "missing" if not found (reportValue = "No")
- sourceText: short snippet from the PDF where you found the A-scan data, or empty string if not found

IMPORTANT:
- Extract ALL diagnoses (including nature of illness) and combine them into a single comma-separated string
- Extract lineOfTreatment separately from diagnosis — it is the procedure/surgery performed, not the condition
- Extract doctor notes broadly — both handwritten and printed clinical remarks, observations, and physician comments — DO NOT include formal diagnosis statements or structured lab values in doctorNotes
- If doctor notes are found, combine them into a single string with double newlines between different notes
- ONLY process Cataract condition. If cataract is present, check for A-scan report presence.
- Look for A-scan data by searching for keywords like "Ascan", "A-scan", "Axial Length", "Axl.", "K1", "K2", "Anis.", or similar terms that indicate A-scan measurements.
- If A-scan report is found (any A-scan measurements present), set reportValue to "Yes" and status to "expected".
- If A-scan report is NOT found, set reportValue to "No" and status to "missing".
- Be comprehensive in extracting all diagnoses and doctor notes - include all relevant clinical information
- Return schema fields only; never include explanations, reasoning, repeated text, or narrative outside the requested values
- Return a SINGLE object with all diagnoses and notes combined`;

export const baseDocumentExtractionPrompt = `Extract the base document information from the entire hospital bill PDF:
- For EVERY scalar field below, return an object in the shape { value, pageNumber }
- pageNumber must always be the physical PDF page index (1-based)
- Do NOT use printed page numbers shown inside the document
- Return concise field values only; never include explanations, reasoning, repeated text, or narrative outside the requested values
- CRITICAL: if you return any non-empty/non-null value for a field, you MUST also return its pageNumber
- Do not leave pageNumber blank when value is present
- If you cannot determine the exact page for a value, do not guess wildly; find the page before returning the value

Fields to extract as { value, pageNumber }:
- hospitalName: Hospital name
- patientName: Patient name
- patientAge: Patient age
- patientGender: Patient gender if mentioned
- policyNumber: Policy/member/IP number if mentioned
- invoiceNumber: Bill/invoice number if mentioned
- admissionDate: Admission date if mentioned
- dischargeDate: Discharge date if mentioned
- date: Document date
- totalAmount: Total bill amount (this is the FINAL amount AFTER any discount is applied)
- discount: Discount amount if present

Also extract DISCOUNT information if present:
- Look for "Discount", "Less: Discount", "Rebate", "Concession", "Special Discount", "Bill Discount" in the bill summary.
- This should be a positive number representing the discount given.

Also extract GST (Goods and Services Tax) information if present:
- Return GST as a single object in the shape:
  gst: {
    value: {
      gstAmount,
      cgstAmount,
      sgstAmount
    },
    pageNumber
  }
- Use ONE shared GST pageNumber for the GST block/section.
Look for GST information in summary sections, tax breakdowns, or footer areas of the bill.

Also extract HOSPITAL BILL BREAKDOWN components if present:
- hospitalBillBreakdown: Extract major components that make up the hospital bill total. Look for sections or summaries that show components like "Actual Bill", "Lens Bill", "Implant Cost", "Room Charges", "Procedure Charges", "Consumables", etc. The sum of these breakdown items should match or be close to the total hospital bill amount.
- For procedure charges, use exactly "Procedure Charges" as the component name—do not expand with sub-categories like "(Medicines / Operation Theatre / Surgeon's Fee / Anesthetist's Fees)".
- Only extract if the bill clearly shows these as separate components
- Each component should have a name (e.g., "Actual Bill", "Lens Bill") and amount

Also extract PACKAGE context:
- isAllInclusivePackage: true if hospital bill is clearly all-inclusive/package style, else false

Also extract DOCUMENT CHECKLIST in this shape:
- documentChecklist: {
    aadharCard: { value: boolean, pageNumber },
    panCard: { value: boolean, pageNumber },
    eCard: { value: boolean, pageNumber },
    invoiceForSurgical: { value: boolean, pageNumber },
    kyc: { value: boolean, pageNumber },
    claimForm: { value: boolean, pageNumber }
  }
- If a document is not present, set value to false and pageNumber to 0.

IMPORTANT NOTE ON DISCOUNT:
- The totalAmount should be the FINAL amount after discount is applied
- The discount field should contain the discount amount as a POSITIVE number
- Example: If bill summary shows "Total: 100,000" and "Less: Discount: 5,000" and "Net Amount: 95,000", then totalAmount = 95,000 and discount = 5,000

IMPORTANT NOTE ON TOTAL AMOUNTS:
Sometimes the totalAmount shown in the PDF and the sum of all individual services may not match due to legitimate calculation errors in the PDF itself. If you identify a clear mistake in the PDF (e.g., incorrect arithmetic, missing items in the total, or incorrect GST calculation), it is acceptable to extract the amounts as they appear in the PDF even if they don't match mathematically. However, if the PDF appears correct, you must be very strict and ensure the sum of all services matches the total amount (accounting for GST and discount if applicable).`;

export const combinedTariffCalculationPrompt = `You are analyzing TWO documents together:

1. HOSPITAL BILL PDF – Contains the detailed list of services actually provided (procedures, room charges, consumables, medications, implants, etc.). Use this internally to understand charge components.
2. TARIFF PDF – Contains the agreed tariff structure, package definitions, caps, limits, exclusions, and special conditions for this hospital.

Your Task
- Analyze the hospital bill to identify context (procedure, package, lens details, eye side) and use policy wordings provided in claim context for lens applicability.
- Review the tariff PDF and EXTRACT tariff values exactly as written.
- Do NOT perform payable calculation, lower-of logic, capping by billed amount, or policy-style adjustment.

Return:
  tariffExtractionItem -> ARRAY of extracted tariff components (primary field; use this everywhere):
    - Each entry must have { code, name, amount, pdfText, pdfPageNumber }.
    - Split combined entries into explicit components when present (e.g., procedure + lens).
    - Example: if row says "Rs.19,000 (excluding lens) plus Rs.7,000 maximum admissible lens cost", return two entries:
      1) { code: "PPN OPH 01 A", name: "Procedure Package (excluding lens)", amount: 19000, pdfText: "cataract (Excluding lens)-Phaco (maximum admissible lens - 7000)", pdfPageNumber: 2 }
      2) { code: "PPN OPH 01 A", name: "Lens (maximum admissible)", amount: 7000, pdfText: "cataract (Excluding lens)-Phaco (maximum admissible lens - 7000)", pdfPageNumber: 2 }
    - pdfText: copy the EXACT verbatim text fragment from the tariff PDF row/line for this item — enough to uniquely identify it by text search (minimum: the procedure name as written in the tariff).
    - pdfPageNumber: the 1-based page number in the TARIFF PDF where this item appears.
    - pdfRowTopPct: approximate vertical position of the TOP of this row as % of page height (0=top, 100=bottom). Estimate visually. Example: row is 60% down the page → 60.
    - pdfRowBottomPct: approximate vertical position of the BOTTOM of this row as % of page height. Usually pdfRowTopPct + 2 to 4 for a single-line row.
    - Do not merge procedure and lens into one entry.
    - Preserve tariff-side amounts as written; do not reduce using hospital bill amounts.
  lensType → Lens/IOL type if mentioned (e.g., Monofocal, Multifocal, Toric). If not mentioned, return exactly: "cant determine".
  lensTypePageNumber → The TARIFF PDF page index (1-based) where the lens type reference is found. If not mentioned or cannot be determined, return 0.
  lensTypeApproved -> apply exactly this logic:
    - if lensType is "cant determine", return exactly: "cant determine"
    - else if lensType is present AND policy wording indicates this lens type is not applicable/not covered/not payable, return false
    - else return true
  eyeType → Eye type for the procedure: "left eye", "right eye", or "both eyes". Determine from the diagnosis, procedure codes, doctor notes, or bill description. If not mentioned or cannot be determined, return exactly: "cant determine".
  tariffPageNumber → The TARIFF PDF page index (1-based) where the tariff reference is found. If not mentioned or cannot be determined, return 0.
  calculationNotes → 2-4 short sentences describing what was extracted from tariff (code/name/components/caps), no calculation narrative.
  clarificationNote -> 1-2 short sentences only for extraction ambiguity (e.g., unreadable amount, multiple similar rows). If none, return exactly: "cant determine".

Critical Rules
1. Do NOT cap tariff values using hospital billed amounts.
2. Do NOT convert "maximum admissible" values into billed values.
3. If tariff row says "Rs.19,000 plus Rs.7,000 lens max", extract those tariff values as-is.
4. Prefer exact numbers from tariff table text even if hospital bill has lower amounts.
5. Keep extraction faithful to tariff document wording and figures.

Return ONLY:
  tariffExtractionItem
  lensType
  lensTypePageNumber
  lensTypeApproved
  eyeType
  tariffPageNumber
  calculationNotes
  clarificationNote`;

export const policyWordingsAdjustmentPrompt = `You are given:
Policy Wordings / Benefit Plan Guidelines – Contains coverage rules, sub-limits, caps, exclusions, co-pay clauses, and special conditions.

## Your Task
- Extract the explicit benefit cap/amount that should act as the policy-side upper limit for claim approval.
- Do NOT calculate final payable or perform arithmetic with hospital/tariff values.
- Only extract what is explicitly stated in policy wording text.

## Extraction Rules
1. Identify explicit financial limits that represent a payable cap:
   - Procedure/package caps
   - Cataract/lens-related limits
   - Event-level sub-limits
2. If multiple limits exist, return the most directly applicable claim payable cap for this case context.
3. If policy wording does not provide a clear numeric cap for this case, return null.
4. Never invent, infer, estimate, or compute a value.

## Return ONLY
- benefitAmount → Numeric cap/benefit amount in INR when explicitly available; otherwise null
- adjustmentNotes → 1–2 short sentences explaining what cap was extracted, or why no explicit cap was found
- insurerType → one of: "niac", "psu", "other", "cant determine"
- policySegment → one of: "retail", "corporate", "cant determine"
- sumInsuredAmount → numeric sum insured in INR when explicit, else null
- niacFlexiFloater → true only when policy explicitly indicates NIAC Flexi Floater, else false
- hasNoCataractLimitClause → true only when wording explicitly indicates no cataract limit/cap/sublimit, else false
- geoLensCap7000Applicable → true only when wording explicitly indicates Tamil Nadu / Kerala / Kolkata / Delhi lens cap applicability, else false`;

export const alignmentCappingsCataractPrompt = (cappings: string[]): string => `
You are reviewing benefit plan alignment conditions for a health insurance claim processor.

Below is a list of alignment cappings extracted from the benefit plan. Each line is in the format "Condition Name: Details / Limits".

${cappings.join("\n")}

From this list, return ONLY the items that are relevant to CATARACT cases.
Cataract-relevant items include anything mentioning: cataract, phacoemulsification, IOL, intraocular lens, lens implant, eye surgery, ophthalmic procedure, or ocular conditions.

Rules:
- Return only the relevant lines, one per line, in the exact same format as given.
- Do not modify, summarize, or rewrite any line.
- If no items are relevant to cataract, return exactly: NONE
- Do not add any explanation, heading, or extra text.
`;

export const benefitPlanLimitExtractionPrompt = (
  cappings: string[],
  diagnosis: string,
): string => `
You are a health insurance claim processor extracting the applicable benefit plan limit for a patient's medical condition.

PATIENT DIAGNOSIS:
${diagnosis}

BENEFIT PLAN ALIGNMENT CAPPINGS (from the insurer's benefit plan database):
${cappings.join("\n")}

YOUR TASK:
From the cappings above, identify the single most applicable monetary limit (in INR) for this patient's diagnosis/condition.

Rules:
1. Look for a numeric amount (₹, Rs, INR) in the cappings that directly applies to the patient's condition.
2. If multiple limits exist, return the most specific and directly applicable one (e.g. a cataract-specific limit over a general eye limit).
3. Extract only the pure numeric value — no currency symbols, no commas. Example: if limit is ₹50,000 return 50000.
4. If no clear numeric limit is found, return null.
5. Never invent or estimate a value not explicitly present in the cappings.

Return ONLY a valid JSON object with no extra text:
{"benefitPlanLimit": <number or null>, "appliedCapping": "<the exact capping line used, or null>", "notes": "<1 sentence explanation>"}
`;
