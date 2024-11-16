const admin = require("firebase-admin");

// Realtime Database 참조
const db = admin.database();

class Question {
  constructor(index, question) {
    this.index = index;
    this.question = question;
  }

  add() {
    const ref = db.ref("bdsm_questions"); // "bdsm_questions" 테이블(참조) 생성
    const newBdsmQuestionRef = ref.push(); // 고유 키로 새 데이터 생성
    newBdsmQuestionRef.set(this);
  }
}

class Answer {
  constructor(
    index,
    question_pk,
    step,
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
    this.question_pk = question_pk;
    this.step = step;
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

  add() {
    const ref = db.ref("bdsm_answers"); // "bdsm" 테이블(참조) 생성
    const newBdsmRef = ref.push(); // 고유 키로 새 데이터 생성
    newBdsmRef.set(this);
  }

  async update() {
    try {
      const ref = db.ref("bdsm_answers");
      const snapshot = await ref
        .orderByChild("index")
        .equalTo(this.index)
        .once("value");

      if (!snapshot.exists()) {
        throw new Error("해당 index에 해당하는 데이터가 없습니다.");
      }

      // Firebase에서 key 추출
      const [key] = Object.keys(snapshot.val());

      // 필드 값 중 `undefined` 값을 null로 변경
      const updatedData = {
        question_pk: this.question_pk,
        step: this.step,
        master_mistress_: this.master_mistress_ || null,
        slave_: this.slave_ || null,
        hunter_: this.hunter_ || null,
        prey_: this.prey_ || null,
        brat_tamer_: this.brat_tamer_ || null,
        brat_: this.brat_ || null,
        owner_: this.owner_ || null,
        pet_: this.pet_ || null,
        daddy_mommy_: this.daddy_mommy_ || null,
        little_: this.little_ || null,
        sadist_: this.sadist_ || null,
        masochist_: this.masochist_ || null,
        spanker_: this.spanker_ || null,
        spankee_: this.spankee_ || null,
        degrader_: this.degrader_ || null,
        degradee_: this.degradee_ || null,
        rigger_: this.rigger_ || null,
        rope_bunny_: this.rope_bunny_ || null,
        dominant_: this.dominant_ || null,
        submissive_: this.submissive_ || null,
        switch_: this.switch_ || null,
        vanilla_: this.vanilla_ || null,
      };

      // 데이터 업데이트
      await ref.child(key).update(updatedData);

      console.log("BDSM 데이터가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("BDSM 데이터 업데이트 오류: ", error.message);
    }
  }
}

module.exports = { Question, Answer };
