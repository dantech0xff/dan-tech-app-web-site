import { reviews } from "@/content/home";
import styles from "./home.module.css";

export function ReviewsSection() {
  return (
    <section className={styles.reviews}>
      <div className={`${styles.reviewsHeading} dt-reveal-70`}>
        <h2 className={styles.titleLg}>Used every day, by people who did not have to.</h2>
      </div>
      <div className={styles.reviewGrid}>
        {reviews.map((review) => (
          <div key={review.reviewer} className={`${styles.review} dt-reveal-50`}>
            <div className={styles.reviewTop}>
              <div className={styles.stars} role="img" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <div className={styles.reviewSource}>STORE REVIEW</div>
            </div>
            <div className={styles.reviewQuote}>{review.quote}</div>
            <div className={styles.reviewer}>
              <img
                src={review.icon}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                className={review.cover ? `${styles.reviewerIcon} ${styles.cover}` : styles.reviewerIcon}
              />
              <div className={styles.reviewerName}>{review.reviewer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
