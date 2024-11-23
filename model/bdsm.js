const admin = require("firebase-admin");

// Realtime Database 참조
const db = admin.database();

class Question {
  constructor(index, question, question_pk) {
    this.index = index;
    this.question = question;
    this.question_pk = question_pk;
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
        index: this.index,
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

class Result {
  constructor(key, tendency, description, type) {
    this.key = key;
    this.tendency = tendency;
    this.description = description;
    this.type = type;
  }

  add() {
    const ref = db.ref("bdsm_results"); // "bdsm" 테이블(참조) 생성
    const newBdsmRef = ref.push(); // 고유 키로 새 데이터 생성
    newBdsmRef.set(this);
  }

  // Firebase에서 데이터를 업데이트하는 메소드
  async update() {
    try {
      const ref = db.ref("bdsm_results"); // Firebase의 "bdsm_results" 노드를 참조

      // Firebase에서 실제 key 값을 기반으로 해당 데이터를 찾습니다.
      const snapshot = await ref
        .orderByChild("key")
        .equalTo(Number(this.key))
        .once("value");

      // 해당 key에 해당하는 데이터가 없으면 에러 처리
      if (!snapshot.exists()) {
        throw new Error("해당 key에 해당하는 데이터가 없습니다.");
      }

      snapshot.forEach(async (childSnapshot) => {
        // 업데이트할 데이터 객체
        const updatedData = {
          tendency: this.tendency || null,
          description: this.description || null,
          type: this.type || null,
        };

        // 해당 key의 데이터를 업데이트
        // `child` 메서드를 이용해 정확한 key로 접근하여 업데이트
        await ref.child(childSnapshot.key).update(updatedData);
      });

      console.log("BDSM 데이터가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("BDSM 데이터 업데이트 오류: ", error.message);
      throw error; // 호출한 곳에서 에러를 처리할 수 있도록 합니다.
    }
  }
}

class Score {
  constructor({
    id,
    age,
    gender,
    sexual_preferance,
    isAgree,
    master_mistress_total,
    slave_total,
    hunter_total,
    prey_total,
    brat_tamer_total,
    brat_total,
    owner_total,
    pet_total,
    daddy_mommy_total,
    little_total,
    sadist_total,
    masochist_total,
    spanker_total,
    spankee_total,
    degrader_total,
    degradee_total,
    rigger_total,
    rope_bunny_total,
    dominant_total,
    submissive_total,
    switch_total,
    vanilla_total,
  }) {
    this.id = id;
    this.age = age;
    this.gender = gender;
    this.sexual_preferance = sexual_preferance;
    this.isAgree = isAgree;
    this.master_mistress_total = master_mistress_total;
    this.slave_total = slave_total;
    this.hunter_total = hunter_total;
    this.prey_total = prey_total;
    this.brat_tamer_total = brat_tamer_total;
    this.brat_total = brat_total;
    this.owner_total = owner_total;
    this.pet_total = pet_total;
    this.daddy_mommy_total = daddy_mommy_total;
    this.little_total = little_total;
    this.sadist_total = sadist_total;
    this.masochist_total = masochist_total;
    this.spanker_total = spanker_total;
    this.spankee_total = spankee_total;
    this.degrader_total = degrader_total;
    this.degradee_total = degradee_total;
    this.rigger_total = rigger_total;
    this.rope_bunny_total = rope_bunny_total;
    this.dominant_total = dominant_total;
    this.submissive_total = submissive_total;
    this.switch_total = switch_total;
    this.vanilla_total = vanilla_total;
  }

  // 데이터를 Firebase에 추가
  add() {
    const ref = db.ref("bdsm_scores"); // "bdsm_scores" 테이블(참조) 생성
    const newResultRef = ref.push(); // 고유 키로 새 데이터 생성
    newResultRef.set(this);
  }
}

module.exports = { Question, Answer, Result, Score };
