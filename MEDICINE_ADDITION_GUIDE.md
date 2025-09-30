# 🏥 Medicine Addition Guide for SymptomMed Ghana

This comprehensive guide will help you properly add new medicines to the system and ensure they work correctly with the symptom matching system.

## 📋 Prerequisites

Before adding a new medicine, ensure you have:

1. ✅ Node.js installed
2. ✅ Access to the project repository
3. ✅ Basic understanding of JSON format
4. ✅ Knowledge of the medicine you want to add
5. ✅ Understanding of Ghanaian OTC medication context

## 🔍 Step 1: Validate Current Data

First, run the validation script to ensure your current data is clean:

```bash
npm run validate-data
```

This will show you any issues with existing data and ensure everything is working correctly.

## 📝 Step 2: Check Symptoms List

Review the existing symptoms in `/public/symptoms.json` to find the appropriate symptom IDs for your medicine.

### Available Symptoms by Category:

#### **Respiratory (10 symptoms)**
- `cough` - Dry or productive cough (Moderate)
- `sore-throat` - Pain or irritation in throat (Mild)
- `runny-nose` - Nasal discharge or congestion (Mild)
- `shortness-breath` - Difficulty breathing or breathlessness (Severe)
- `wheezing` - High-pitched whistling sound when breathing (Moderate)
- `sneezing` - Involuntary expulsion of air from nose (Mild)

#### **Neurological (4 symptoms)**
- `headache` - Pain in head or neck region (Mild)
- `dizziness` - Feeling lightheaded or unsteady (Moderate)
- `difficulty-sleeping` - Trouble falling or staying asleep (Mild)

#### **Musculoskeletal (4 symptoms)**
- `body-aches` - Muscle or joint pain (Moderate)
- `joint-pain` - Pain in joints (Moderate)
- `muscle-pain` - Pain in muscles (Moderate)
- `back-pain` - Pain in back area (Moderate)

#### **Gastrointestinal (4 symptoms)**
- `nausea` - Feeling sick to stomach (Mild)
- `vomiting` - Forceful expulsion of stomach contents (Moderate)
- `diarrhea` - Frequent loose or liquid bowel movements (Moderate)
- `abdominal-pain` - Pain in stomach area (Moderate)

#### **Systemic (5 symptoms)**
- `fever` - Elevated body temperature above 38°C (Moderate)
- `fatigue` - Feeling tired or exhausted (Mild)
- `chills` - Feeling cold with shivering (Moderate)
- `excessive-thirst` - Increased thirst and fluid intake (Moderate)
- `weight-loss` - Losing weight without trying (Moderate)

#### **Cardiovascular (2 symptoms)**
- `chest-pain` - Pain or discomfort in chest area (Severe)
- `high-blood-pressure` - Elevated blood pressure readings (Severe)

#### **Ocular (2 symptoms)**
- `itchy-eyes` - Itching sensation in eyes (Mild)
- `blurred-vision` - Unclear or fuzzy vision (Moderate)

#### **Dermatological (1 symptom)**
- `skin-rash` - Redness or irritation of skin (Mild)

#### **Psychological (1 symptom)**
- `anxiety` - Feeling of worry or nervousness (Moderate)

#### **Renal (1 symptom)**
- `frequent-urination` - Needing to urinate more often than usual (Mild)

## 📋 Step 3: Use the Medicine Template

Copy the template from `/templates/medicine-template.json`:

```json
{
  "id": "medXXX",
  "brandName": "Medicine Brand Name",
  "genericName": "Generic Name",
  "description": "Brief description of the medicine",
  "usage": "Primary use and purpose",
  "dosageAdult": "Adult dosage instructions",
  "dosageChild": "Child dosage instructions",
  "dosageElderly": "Elderly dosage instructions",
  "sideEffects": "Possible side effects",
  "warnings": "Important safety warnings",
  "priceRange": "GHS X-Y",
  "category": "Medicine Category",
  "drugClass": "Drug Class",
  "prescription": false,
  "controlled": false,
  "symptomMappings": [
    {
      "symptomId": "symptom-id",
      "effectivenessScore": 8,
      "isPrimary": true,
      "evidenceLevel": "Strong",
      "notes": "Effectiveness notes"
    }
  ]
}
```

## 🔧 Step 4: Fill in the Medicine Details

### Required Fields:

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique identifier starting with "med" | `"med121"` |
| `brandName` | Commercial brand name | `"Panadol"` |
| `genericName` | Generic/chemical name | `"Paracetamol"` |
| `description` | Brief description | `"Pain reliever and fever reducer"` |
| `usage` | Primary use and purpose | `"For relief of mild to moderate pain and fever"` |
| `symptomMappings` | Array of symptom mappings | See below |

### Optional but Recommended Fields:

| Field | Description | Example |
|-------|-------------|---------|
| `dosageAdult` | Adult dosage instructions | `"1-2 tablets (500-1000mg) every 4-6 hours"` |
| `dosageChild` | Child dosage instructions | `"10-15mg/kg every 4-6 hours"` |
| `dosageElderly` | Elderly dosage instructions | `"Same as adult, but monitor liver function"` |
| `sideEffects` | Possible side effects | `"Rare when used as directed. May cause liver damage if taken in excess."` |
| `warnings` | Important safety warnings | `"Do not take with other paracetamol-containing products."` |
| `priceRange` | Price range in GHS | `"GHS 5-15"` |
| `category` | Medicine category | `"Pain Relief"` |
| `drugClass` | Drug class | `"Analgesic"` |
| `prescription` | Requires prescription? | `false` |
| `controlled` | Controlled substance? | `false` |

## 🏷️ Step 5: Choose Appropriate Category and Drug Class

### Available Categories:
- `Allergy` - For allergy medications
- `Antibiotic` - Antibiotic medicines
- `Antimalarial` - Antimalarial drugs
- `Antiparasitic` - Antiparasitic medications
- `Anxiety` - Anti-anxiety medications
- `Cardiovascular` - Heart and blood pressure medications
- `Cold & Allergy` - Cold and allergy combination products
- `Cough & Cold` - Cough and cold medications
- `Diabetes` - Diabetes medications
- `Digestive` - Digestive system medications
- `Herbal` - Herbal remedies
- `Pain Relief` - Pain relief medications
- `Respiratory` - Respiratory medications
- `Supplement` - Dietary supplements
- `Vitamin` - Vitamin supplements

### Available Drug Classes:
- `ACE Inhibitor` - Blood pressure medications
- `ARB` - Angiotensin II receptor blockers
- `Analgesic` - Pain relievers
- `Antacid` - Acid reducers
- `Antihistamine` - Allergy medications
- `Antihistamine + Decongestant` - Combination allergy medications
- `Antitussive` - Cough suppressants
- `Bronchodilator` - Asthma medications
- `Decongestant` - Nasal decongestants
- `Diuretic` - Water pills
- `Expectorant` - Mucus thinners
- `Herbal Supplement` - Herbal products
- `NSAID` - Non-steroidal anti-inflammatory drugs
- `Probiotic` - Beneficial bacteria
- `Proton Pump Inhibitor` - Acid reducers
- `Statin` - Cholesterol medications
- `Vitamin` - Vitamin supplements
- And many more...

## 🔗 Step 6: Configure Symptom Mappings

This is the most important part - it connects your medicine to symptoms!

### Symptom Mapping Structure:

```json
{
  "symptomId": "symptom-id",
  "effectivenessScore": 8,
  "isPrimary": true,
  "evidenceLevel": "Strong",
  "notes": "Effectiveness notes"
}
```

### Mapping Fields:

| Field | Description | Valid Values |
|-------|-------------|-------------|
| `symptomId` | **Must match** an ID from symptoms.json | `"headache"`, `"fever"`, etc. |
| `effectivenessScore` | Effectiveness rating (1-10) | `1` (ineffective) to `10` (very effective) |
| `isPrimary` | Is this a primary use for the medicine? | `true` or `false` |
| `evidenceLevel` | Strength of clinical evidence | `"Strong"`, `"Moderate"`, `"Weak"`, `"Theoretical"` |
| `notes` | Additional effectiveness notes | `"First-line treatment for fever"` |

### Guidelines for Symptom Mappings:

1. **Use Real symptomIds**: Always reference IDs from `/public/symptoms.json`
2. **Be realistic with scores**: 
   - `1-3`: Poor effectiveness
   - `4-6`: Moderate effectiveness  
   - `7-8`: Good effectiveness
   - `9-10`: Excellent effectiveness
3. **Primary vs Secondary**: 
   - `isPrimary: true` for main uses
   - `isPrimary: false` for secondary/beneficial effects
4. **Evidence Levels**:
   - `"Strong"`: Well-established clinical evidence
   - `"Moderate"`: Good clinical evidence
   - `"Weak"`: Limited clinical evidence
   - `"Theoretical"`: Theoretical/research-based only

## 📊 Step 7: Example - Adding Paracetamol

Here's a complete example for adding Paracetamol:

```json
{
  "id": "med121",
  "brandName": "Panadol",
  "genericName": "Paracetamol",
  "description": "Pain reliever and fever reducer",
  "usage": "For relief of mild to moderate pain and fever",
  "dosageAdult": "1-2 tablets (500-1000mg) every 4-6 hours as needed, maximum 4000mg/day",
  "dosageChild": "10-15mg/kg every 4-6 hours, consult doctor for children under 2",
  "dosageElderly": "Same as adult, but monitor liver function",
  "sideEffects": "Rare when used as directed. May cause liver damage if taken in excess.",
  "warnings": "Do not take with other paracetamol-containing products. Avoid alcohol. Not recommended with liver disease.",
  "priceRange": "GHS 5-15",
  "category": "Pain Relief",
  "drugClass": "Analgesic",
  "prescription": false,
  "controlled": false,
  "symptomMappings": [
    {
      "symptomId": "fever",
      "effectivenessScore": 9,
      "isPrimary": true,
      "evidenceLevel": "Strong",
      "notes": "First-line treatment for fever"
    },
    {
      "symptomId": "headache",
      "effectivenessScore": 8,
      "isPrimary": true,
      "evidenceLevel": "Strong",
      "notes": "Effective for mild to moderate headaches"
    },
    {
      "symptomId": "body-aches",
      "effectivenessScore": 7,
      "isPrimary": false,
      "evidenceLevel": "Moderate",
      "notes": "Helps with general body aches"
    }
  ]
}
```

## 📊 Step 8: Example - Adding an Antimalarial

```json
{
  "id": "med122",
  "brandName": "Lonart",
  "genericName": "Artemether-Lumefantrine",
  "description": "Antimalarial medication for treatment of uncomplicated malaria",
  "usage": "Treatment of uncomplicated Plasmodium falciparum malaria",
  "dosageAdult": "4 tablets at 0, 8, 24, 36, 48, and 60 hours (total 24 tablets)",
  "dosageChild": "Dosing based on body weight, consult healthcare provider",
  "dosageElderly": "Same as adult, monitor for side effects",
  "sideEffects": "Headache, dizziness, nausea, vomiting, abdominal pain",
  "warnings": "Take with food. Not for prevention, only treatment. Complete full course even if feeling better.",
  "priceRange": "GHS 15-25",
  "category": "Antimalarial",
  "drugClass": "Artemisinin Combination",
  "prescription": false,
  "controlled": false,
  "symptomMappings": [
    {
      "symptomId": "fever",
      "effectivenessScore": 10,
      "isPrimary": true,
      "evidenceLevel": "Strong",
      "notes": "Highly effective for malaria-related fever"
    },
    {
      "symptomId": "headache",
      "effectivenessScore": 8,
      "isPrimary": false,
      "evidenceLevel": "Moderate",
      "notes": "Helps with malaria-associated headaches"
    },
    {
      "symptomId": "chills",
      "effectivenessScore": 9,
      "isPrimary": true,
      "evidenceLevel": "Strong",
      "notes": "Effective for malaria chills"
    },
    {
      "symptomId": "fatigue",
      "effectivenessScore": 7,
      "isPrimary": false,
      "evidenceLevel": "Moderate",
      "notes": "Helps reduce malaria-related fatigue"
    }
  ]
}
```

## ✅ Step 9: Add to Medicines JSON

1. Open `/public/medicines.json`
2. Add your new medicine to the `medicines` array
3. **Ensure proper JSON formatting** (commas, brackets, etc.)
4. Save the file

### Important Notes:
- Use a unique ID (check existing medicines first)
- Maintain alphabetical order by brand name if possible
- Ensure proper comma placement between array items
- Validate JSON syntax before saving

## 🧪 Step 10: Validate Your Addition

Run the validation script again:

```bash
npm run validate-data
```

This will catch any issues with your new medicine entry.

## 🚀 Step 11: Test the Medicine

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Test your new medicine:
   - Search for it in the browse tab
   - Select symptoms it should treat
   - Check if it appears in recommendations
   - Click "View Details" to see the medicine details page
   - Test all filters (category, drug class, etc.)

## 🔍 Common Issues and Solutions

### ❌ "Symptom not found" error
**Problem**: You used a `symptomId` that doesn't exist in `symptoms.json`
**Solution**: Check `/public/symptoms.json` for valid symptom IDs

### ❌ "No recommendations found" 
**Problem**: Medicine has incorrect symptom mappings or effectiveness scores
**Solution**: Verify symptom mappings are correct and scores are realistic

### ❌ "Medicine details not loading"
**Problem**: Missing required fields or JSON syntax error
**Solution**: Run validation script and check JSON formatting

### ❌ "Duplicate ID" error
**Problem**: You used an ID that already exists
**Solution**: Use a unique ID (check existing medicines first)

### ❌ "Category not found" error
**Problem**: You used a category that doesn't exist
**Solution**: Use one of the predefined categories listed in this guide

### ❌ "Drug class not found" error
**Problem**: You used a drug class that doesn't exist
**Solution**: Use one of the predefined drug classes listed in this guide

## 📝 Best Practices

1. **Start with existing medicines**: Use existing entries as templates
2. **Be conservative with scores**: It's better to underestimate effectiveness
3. **Provide detailed information**: More details help users make informed decisions
4. **Include safety warnings**: Always include important safety information
5. **Use realistic pricing**: Use actual Ghanaian price ranges
6. **Consider local context**: Ensure medicines are relevant to Ghanaian healthcare
7. **Test thoroughly**: Always test new additions before deploying
8. **Document sources**: Keep notes on your evidence sources for effectiveness ratings

## 🎯 Quality Checklist

Before finalizing your medicine addition, verify:

- [ ] All required fields are filled
- [ ] Symptom IDs are valid (from symptoms.json)
- [ ] Effectiveness scores are realistic (1-10)
- [ ] Category and drug class are from predefined lists
- [ ] Dosage information is clear and accurate
- [ ] Safety warnings are included
- [ ] Price range is realistic for Ghana
- [ ] JSON syntax is correct
- [ ] Validation script passes
- [ ] Medicine appears correctly in the application

## 🆘 Need Help?

If you encounter issues:

1. Check the validation script output first
2. Review existing medicine entries for examples
3. Ensure JSON syntax is correct
4. Verify all symptom IDs exist in symptoms.json
5. Check that category and drug class are from the predefined lists
6. Test in the development environment

## 📚 Additional Resources

- **Symptoms Reference**: `/public/symptoms.json`
- **Medicine Template**: `/templates/medicine-template.json`
- **Validation Script**: `npm run validate-data`
- **Existing Examples**: `/public/medicines.json`

---

Remember: This system helps real people make health decisions. Accuracy and attention to detail are crucial! 🏥💙

**When in doubt, consult healthcare professionals and official medical resources.**