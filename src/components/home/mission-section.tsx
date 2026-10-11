import { principles } from "@/content/home";
import styles from "./home.module.css";

export function MissionSection() {
  return (
    <section className={styles.mission}>
      <div className={styles.missionInner}>
        <div className={`${styles.missionCopy} dt-reveal-60`}>
          <h2 className={styles.titleXl}>
            Build apps that make people&apos;s lives more convenient — and more successful.
          </h2>
          <p className={styles.missionText}>
            Convenience is the product. Success is the outcome. Every app removes one everyday friction; the Academy
            hands the skill itself to the next builder.
          </p>
          <div className={styles.vision}>
            <div className={styles.visionLabel}>Vision</div>
            <div className={styles.visionText}>
              A Vietnamese indie studio whose apps feel inevitable — small, honest and used every day — and a
              generation of mobile developers who can build the same.
            </div>
          </div>
        </div>

        <div className={styles.principles}>
          {principles.map((principle, index) => (
            <div key={principle.title} className={`${styles.principle} dt-reveal-60`}>
              <div className={styles.principleNumber}>{String(index + 1).padStart(2, "0")}</div>
              <div className={styles.principleBody}>
                <div className={styles.principleTitle}>{principle.title}</div>
                <div className={styles.principleText}>{principle.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
