const mongoose = require('mongoose');
const Section = require('./models/Section');

const MONGODB_URI = 'mongodb+srv://IPCfinder:UhMJn8T9bSRwU3aN@ipcfinder.dbnlevh.mongodb.net/ipc-finder';

const newSections = [
  // Traffic & Motor Vehicles Act
  {
    code: 'IPC 279',
    name: 'Rash Driving or Riding on a Public Way',
    simpleMeaning: 'Driving or riding a vehicle on a public road in a rash or negligent manner that endangers human life or safety',
    punishment: 'Imprisonment up to 6 months, or fine up to ₹1000, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 337',
    name: 'Causing Hurt by Act Endangering Life or Personal Safety',
    simpleMeaning: 'Causing hurt to any person by doing an act so rashly or negligently as to endanger human life',
    punishment: 'Imprisonment up to 6 months, or fine up to ₹500, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 338',
    name: 'Causing Grievous Hurt by Act Endangering Life or Personal Safety',
    simpleMeaning: 'Causing grievous hurt by doing an act so rashly or negligently as to endanger human life or safety',
    punishment: 'Imprisonment up to 2 years, or fine up to ₹1000, or both',
    firPossible: 'Yes'
  },
  {
    code: 'MV Act 184',
    name: 'Driving Dangerously',
    simpleMeaning: 'Driving a motor vehicle at excessive speed or in a manner that is dangerous to the public',
    punishment: 'First offense: Imprisonment up to 6 months and/or fine up to ₹1000. Subsequent offense: Up to 2 years and/or ₹2000',
    firPossible: 'Yes'
  },

  // NDPS Act (Drugs)
  {
    code: 'NDPS Act 8',
    name: 'Prohibition of Certain Operations',
    simpleMeaning: 'Prohibition of cultivation, production, manufacture, possession, sale, transport, or use of narcotic drugs and psychotropic substances',
    punishment: 'Small quantity: Up to 1 year and/or fine ₹10,000. Commercial: 10-20 years and fine ₹1-2 lakh',
    firPossible: 'Yes'
  },
  {
    code: 'NDPS Act 20',
    name: 'Punishment for Contravention in Relation to Cannabis Plant and Cannabis',
    simpleMeaning: 'Illegal cultivation, production, possession, or trafficking of cannabis (ganja, charas)',
    punishment: 'Small quantity: Up to 6 months and/or ₹10,000. Commercial: 10-20 years and ₹1-2 lakh',
    firPossible: 'Yes'
  },
  {
    code: 'NDPS Act 21',
    name: 'Punishment for Contravention in Relation to Manufactured Drugs',
    simpleMeaning: 'Illegal production, possession, sale, or transport of manufactured drugs (cocaine, heroin, morphine)',
    punishment: 'Small quantity: Up to 1 year and/or ₹10,000. Commercial: 10-20 years and ₹1-2 lakh',
    firPossible: 'Yes'
  },
  {
    code: 'NDPS Act 27',
    name: 'Punishment for Consumption of Any Narcotic Drug or Psychotropic Substance',
    simpleMeaning: 'Consuming any narcotic drug or psychotropic substance',
    punishment: 'Up to 1 year, or fine up to ₹20,000, or both. Repeat offense: Up to 2 years and fine ₹30,000',
    firPossible: 'Yes'
  },

  // Prevention of Corruption Act
  {
    code: 'IPC 7',
    name: 'Public Servant Taking Gratification Other Than Legal Remuneration',
    simpleMeaning: 'Public servant accepting or obtaining illegal gratification (bribe) for official acts',
    punishment: 'Imprisonment from 6 months to 5 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 13',
    name: 'Criminal Misconduct by a Public Servant',
    simpleMeaning: 'Public servant obtaining valuable thing without consideration, or abusing position for pecuniary advantage',
    punishment: 'Imprisonment from 4 to 10 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'PC Act 7',
    name: 'Public Servant Taking Gratification',
    simpleMeaning: 'Public servant accepting illegal gratification (bribe) under Prevention of Corruption Act',
    punishment: 'Imprisonment from 6 months to 5 years and fine',
    firPossible: 'Yes'
  },
  {
    code: 'PC Act 13',
    name: 'Criminal Misconduct by Public Servant',
    simpleMeaning: 'Public servant committing criminal misconduct by corrupt or illegal means',
    punishment: 'Imprisonment from 4 to 10 years and fine',
    firPossible: 'Yes'
  },

  // POCSO Act (Child Protection)
  {
    code: 'POCSO Act 3',
    name: 'Punishment for Penetrative Sexual Assault',
    simpleMeaning: 'Sexual assault involving penetration on a child under 18 years',
    punishment: 'Minimum 10 years, may extend to life imprisonment and fine. Death penalty if child under 16',
    firPossible: 'Yes'
  },
  {
    code: 'POCSO Act 4',
    name: 'Punishment for Penetrative Sexual Assault by Person in Position of Trust',
    simpleMeaning: 'Sexual assault by someone in position of trust or authority over the child',
    punishment: 'Minimum 10 years, may extend to life imprisonment and fine',
    firPossible: 'Yes'
  },
  {
    code: 'POCSO Act 5',
    name: 'Punishment for Aggravated Penetrative Sexual Assault',
    simpleMeaning: 'Aggravated sexual assault on child (by police, armed forces, causing injury, etc.)',
    punishment: 'Minimum 20 years to life imprisonment and fine',
    firPossible: 'Yes'
  },
  {
    code: 'POCSO Act 9',
    name: 'Punishment for Aggravated Sexual Assault',
    simpleMeaning: 'Aggravated sexual assault (without penetration) on a child',
    punishment: 'Minimum 5 years, may extend to 7 years and fine',
    firPossible: 'Yes'
  },

  // Environmental Protection Acts
  {
    code: 'EPA Act 15',
    name: 'Penalty for Contravention of Provisions of Act',
    simpleMeaning: 'Violation of environmental protection regulations causing pollution or environmental harm',
    punishment: 'Up to 5 years and fine up to ₹1 lakh. Continuing offense: Additional ₹5000/day',
    firPossible: 'Yes'
  },
  {
    code: 'Water Act 43',
    name: 'Penalty for Pollution of Stream or Well',
    simpleMeaning: 'Discharging polluting matter into water sources in violation of Water Act',
    punishment: 'Up to 6 years and fine. Continuing offense: Additional ₹5000/day',
    firPossible: 'Yes'
  },
  {
    code: 'Air Act 37',
    name: 'Penalty for Contravention of Air Pollution Control Provisions',
    simpleMeaning: 'Operating industry or vehicle causing air pollution in violation of Air Act',
    punishment: 'Up to 3 months and/or fine up to ₹10,000. Continuing: Additional ₹5000/day',
    firPossible: 'Yes'
  },
  {
    code: 'Forest Act 26',
    name: 'Penalties for Acts in Contravention of Act',
    simpleMeaning: 'Illegal felling, removal, or damage to forest produce, or trespassing in reserved forests',
    punishment: 'Up to 6 months or fine, or both. Major offenses: Up to 2 years',
    firPossible: 'Yes'
  },

  // Labor Laws
  {
    code: 'Child Labour Act 3',
    name: 'Prohibition of Employment of Children in Certain Occupations',
    simpleMeaning: 'Employing children (under 14) in hazardous occupations or processes',
    punishment: 'Imprisonment from 6 months to 2 years and/or fine ₹20,000 to ₹50,000',
    firPossible: 'Yes'
  },
  {
    code: 'Bonded Labour Act 16',
    name: 'Punishment for Enforcement of Bonded Labour',
    simpleMeaning: 'Compelling any person to render bonded labor or accepting bonded labor',
    punishment: 'Up to 3 years and fine up to ₹2000',
    firPossible: 'Yes'
  },
  {
    code: 'Factories Act 92',
    name: 'Penalty for Obstructing Inspector',
    simpleMeaning: 'Obstruction of factory inspector or violation of safety regulations in factories',
    punishment: 'Up to 2 years or fine up to ₹100,000, or both',
    firPossible: 'Yes'
  },

  // Food Safety Act
  {
    code: 'FSS Act 59',
    name: 'Penalty for Unsafe Food',
    simpleMeaning: 'Manufacturing, distributing, or selling unsafe, adulterated, or misbranded food',
    punishment: 'Up to 6 months and fine up to ₹5 lakh. Grievous injury/death: Up to life imprisonment',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 272',
    name: 'Adulteration of Food or Drink Intended for Sale',
    simpleMeaning: 'Adulterating food or drink making it noxious, intended for sale',
    punishment: 'Up to 6 months or fine up to ₹1000, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 273',
    name: 'Sale of Noxious Food or Drink',
    simpleMeaning: 'Selling any food or drink as noxious (knowing it to be so)',
    punishment: 'Up to 6 months or fine up to ₹1000, or both',
    firPossible: 'Yes'
  },
  {
    code: 'IPC 274',
    name: 'Adulteration of Drugs',
    simpleMeaning: 'Adulterating drugs or medical preparations reducing efficacy or making them noxious',
    punishment: 'Up to 6 months or fine up to ₹1000, or both',
    firPossible: 'Yes'
  }
];

async function addSections() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let existingCount = 0;
    let addedCount = 0;

    for (const sectionData of newSections) {
      const existing = await Section.findOne({ code: sectionData.code });
      
      if (existing) {
        console.log(`⏭️  Already exists: ${sectionData.code}`);
        existingCount++;
      } else {
        await Section.create(sectionData);
        console.log(`✅ Added ${sectionData.code}: ${sectionData.name}`);
        addedCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Existing: ${existingCount}`);
    console.log(`   Added: ${addedCount}`);
    console.log(`   Total: ${newSections.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

addSections();
