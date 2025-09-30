const fs = require('fs');
const path = require('path');

// Load data
const medicinesPath = path.join(__dirname, '../public/medicines.json');
const symptomsPath = path.join(__dirname, '../public/symptoms.json');

console.log('🔍 Validating medicine and symptom data...');

try {
  const medicines = JSON.parse(fs.readFileSync(medicinesPath, 'utf8'));
  const symptoms = JSON.parse(fs.readFileSync(symptomsPath, 'utf8'));

  // Get all symptom IDs
  const symptomIds = symptoms.symptoms.map(s => s.id);
  const symptomNames = new Set(symptoms.symptoms.map(s => s.name.toLowerCase()));

  // Check for issues
  const issues = [];
  const warnings = [];

  console.log(`📊 Found ${medicines.medicines.length} medicines and ${symptoms.symptoms.length} symptoms`);

  // Check each medicine
  medicines.medicines.forEach((medicine, index) => {
    // Check for required fields
    if (!medicine.id) {
      issues.push(`❌ Medicine at index ${index}: Missing id`);
    } else if (!medicine.id.startsWith('med')) {
      warnings.push(`⚠️  Medicine ${medicine.id}: ID should start with 'med'`);
    }
    
    if (!medicine.brandName) {
      issues.push(`❌ Medicine ${medicine.id || 'at index ' + index}: Missing brandName`);
    }
    
    if (!medicine.genericName) {
      issues.push(`❌ Medicine ${medicine.id || 'at index ' + index}: Missing genericName`);
    }
    
    if (!medicine.description) {
      issues.push(`❌ Medicine ${medicine.id}: Missing description`);
    }
    
    if (!medicine.usage) {
      issues.push(`❌ Medicine ${medicine.id}: Missing usage`);
    }
    
    if (!Array.isArray(medicine.symptomMappings) || medicine.symptomMappings.length === 0) {
      issues.push(`❌ Medicine ${medicine.id}: Missing or empty symptomMappings`);
    } else {
      // Check symptom mappings
      medicine.symptomMappings.forEach((mapping, mappingIndex) => {
        if (!mapping.symptomId) {
          issues.push(`❌ Medicine ${medicine.id}: Mapping at index ${mappingIndex}: Missing symptomId`);
        } else if (!symptomIds.includes(mapping.symptomId)) {
          issues.push(`❌ Medicine ${medicine.id}: Mapping at index ${mappingIndex}: Unknown symptomId '${mapping.symptomId}'`);
        }
        
        if (typeof mapping.effectivenessScore !== 'number' || 
            mapping.effectivenessScore < 1 || 
            mapping.effectivenessScore > 10) {
          issues.push(`❌ Medicine ${medicine.id}: Mapping at index ${mappingIndex}: Invalid effectivenessScore (must be 1-10)`);
        }
        
        if (typeof mapping.isPrimary !== 'boolean') {
          issues.push(`❌ Medicine ${medicine.id}: Mapping at index ${mappingIndex}: Invalid isPrimary value (must be boolean)`);
        }
        
        if (mapping.evidenceLevel && !['Strong', 'Moderate', 'Weak', 'Theoretical'].includes(mapping.evidenceLevel)) {
          warnings.push(`⚠️  Medicine ${medicine.id}: Mapping at index ${mappingIndex}: Non-standard evidenceLevel '${mapping.evidenceLevel}'`);
        }
      });
    }
    
    // Check for reasonable data
    if (medicine.priceRange && !medicine.priceRange.includes('GHS')) {
      warnings.push(`⚠️  Medicine ${medicine.id}: Price range should include 'GHS'`);
    }
    
    if (medicine.category && !['Pain Relief', 'Antibiotic', 'Antimalarial', 'Antihistamine', 'Anti-inflammatory', 'Antifungal', 'Antiviral', 'Antidiabetic', 'Antihypertensive', 'Digestive'].includes(medicine.category)) {
      warnings.push(`⚠️  Medicine ${medicine.id}: Unusual category '${medicine.category}'`);
    }
  });

  // Check for duplicate medicine IDs
  const medicineIds = new Set();
  medicines.medicines.forEach((medicine, index) => {
    if (medicineIds.has(medicine.id)) {
      issues.push(`❌ Duplicate medicine ID: ${medicine.id}`);
    } else {
      medicineIds.add(medicine.id);
    }
  });

  // Check for unused symptoms
  const usedSymptomIds = new Set();
  medicines.medicines.forEach(medicine => {
    if (medicine.symptomMappings) {
      medicine.symptomMappings.forEach(mapping => {
        if (mapping.symptomId) {
          usedSymptomIds.add(mapping.symptomId);
        }
      });
    }
  });

  const unusedSymptoms = symptomIds.filter(id => !usedSymptomIds.has(id));
  if (unusedSymptoms.length > 0) {
    console.log(`⚠️  ${unusedSymptoms.length} symptoms are not used by any medicine:`);
    unusedSymptoms.forEach(id => {
      const symptom = symptoms.symptoms.find(s => s.id === id);
      console.log(`   - ${id}: ${symptom ? symptom.name : 'Unknown'}`);
    });
  }

  // Check symptoms data
  symptoms.symptoms.forEach((symptom, index) => {
    if (!symptom.id) {
      issues.push(`❌ Symptom at index ${index}: Missing id`);
    }
    
    if (!symptom.name) {
      issues.push(`❌ Symptom ${symptom.id || 'at index ' + index}: Missing name`);
    }
    
    if (!symptom.description) {
      issues.push(`❌ Symptom ${symptom.id}: Missing description`);
    }
    
    if (!symptom.category) {
      issues.push(`❌ Symptom ${symptom.id}: Missing category`);
    }
    
    if (!['Mild', 'Moderate', 'Severe'].includes(symptom.severity)) {
      issues.push(`❌ Symptom ${symptom.id}: Invalid severity '${symptom.severity}'`);
    }
  });

  // Check for duplicate symptom IDs
  const symptomIdSet = new Set();
  symptoms.symptoms.forEach((symptom, index) => {
    if (symptomIdSet.has(symptom.id)) {
      issues.push(`❌ Duplicate symptom ID: ${symptom.id}`);
    } else {
      symptomIdSet.add(symptom.id);
    }
  });

  // Report results
  if (issues.length > 0) {
    console.error(`\n❌ Found ${issues.length} critical issues with the data:`);
    issues.forEach(issue => console.error(`  ${issue}`));
    console.error('\n🛑  Please fix these issues before proceeding.');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(`\n✅ Data validation passed with ${warnings.length} warnings:`);
    warnings.forEach(warning => console.log(`  ${warning}`));
    console.log('\n🎉 Your data is ready to use!');
  } else {
    console.log('\n🎉 Perfect! Data validation passed with no issues or warnings.');
    console.log('📈 All medicines are properly linked to symptoms.');
    console.log('🔗 No duplicate IDs found.');
    console.log('✨ All required fields are present.');
  }

  // Generate summary report
  console.log('\n📋 Summary Report:');
  console.log(`   Total Medicines: ${medicines.medicines.length}`);
  console.log(`   Total Symptoms: ${symptoms.symptoms.length}`);
  console.log(`   Used Symptoms: ${usedSymptomIds.size}`);
  console.log(`   Unused Symptoms: ${unusedSymptoms.length}`);
  console.log(`   Medicine-Symptom Links: ${medicines.medicines.reduce((total, med) => total + med.symptomMappings.length, 0)}`);

} catch (error) {
  console.error('❌ Error reading data files:', error.message);
  process.exit(1);
}