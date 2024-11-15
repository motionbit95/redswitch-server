const admin = require("firebase-admin");

// Realtime Database 참조
const db = admin.database();

class Bdsm {
  constructor(
    index,
    question,
    master_mistress_,
    slave_,
    hunter_,
    prey_,
    brat_tamer_,
    brat_,
    owner_,
    pet_,
    daddy_mommy_,
    little_,
    sadist_,
    masochist_,
    spanker_,
    spankee_,
    degrader_,
    degradee_,
    rigger_,
    rope_bunny_,
    dominant_,
    submissive_,
    switch_,
    vanilla_
  ) {
    this.index = index;
    this.question = question;
    this.master_mistress_ = master_mistress_;
    this.slave_ = slave_;
    this.hunter_ = hunter_;
    this.prey_ = prey_;
    this.brat_tamer_ = brat_tamer_;
    this.brat_ = brat_;
    this.owner_ = owner_;
    this.pet_ = pet_;
    this.daddy_mommy_ = daddy_mommy_;
    this.little_ = little_;
    this.sadist_ = sadist_;
    this.masochist_ = masochist_;
    this.spanker_ = spanker_;
    this.spankee_ = spankee_;
    this.degrader_ = degrader_;
    this.degradee_ = degradee_;
    this.rigger_ = rigger_;
    this.rope_bunny_ = rope_bunny_;
    this.dominant_ = dominant_;
    this.submissive_ = submissive_;
    this.switch_ = switch_;
    this.vanilla_ = vanilla_;
  }

  addBdsm() {
    const ref = db.ref("bdsm"); // "bdsm" 테이블(참조) 생성
    const newBdsmRef = ref.push(); // 고유 키로 새 데이터 생성
    newBdsmRef.set(this);
  }
}

module.exports = Bdsm;
