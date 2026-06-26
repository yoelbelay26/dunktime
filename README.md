# 🏀 DunkTime

**אפליקציית כדורסל חברתית** — מצא משחקים, הצטרף לשחקנים, ותארגן מגרשים בעיר שלך.

🔗 **אתר חי:** [dunktime.vercel.app](https://dunktime.vercel.app)

---

## מה המוצר עושה

DunkTime מאפשרת לשחקני כדורסל אמאטורים למצוא משחקים פתוחים בעיר שלהם, להצטרף אליהם, וליצור קבוצות עם צ'אט בזמן אמת — הכל ממסך אחד.

---

## איזו בעיה הפרויקט פותר

שחקני כדורסל חובבים מתקשים למצוא עם מי לשחק. כיום הם מסתמכים על קבוצות וואטסאפ, פוסטים בפייסבוק, או סתם הגעה למגרש ותקווה שיש מישהו. אין פלטפורמה מרוכזת שמחברת שחקנים לפי עיר, מגרש, ומועד.

---

## קהל היעד

שחקני כדורסל חובבים בגילאי 15–40 בישראל, שרוצים לשחק משחקי רחוב / פיק-אפ בקרבת מקום ומחפשים שחקנים נוספים להשלים קבוצה.

---

## מתחרים ובידול

| מתחרה | החיסרון שלו |
|---|---|
| קבוצות וואטסאפ | פיזורי, ידני, קשה למצוא משחקים חדשים |
| פייסבוק / אינסטגרם | לא ממוקד לכדורסל, אין ניהול משחקים |
| SportyHQ / Meetup | לא מותאם לשוק הישראלי, אין עברית |
| הגעה ישירה למגרש | לא יודע אם יש שחקנים, עלול לבוא לחינם |

**הבידול של DunkTime:** ממשק עברי RTL, מגרשים אמיתיים לפי עיר, הצטרפות בלחיצה, וצ'אט קבוצתי לכל משחק.

---

## זרימה עיקרית

1. נרשמים עם אימייל + שם + עיר
2. בדף הבית רואים משחקים פתוחים בעיר שלך
3. לוחצים "מצא לי משחק" → רואים כל המשחקים הפתוחים בעיר
4. מצטרפים למשחק → נכנסים לצ'אט הקבוצתי
5. יוצרים משחק חדש → שחקנים בעיר רואים ויכולים להצטרף

---

## הרצה מקומית

```bash
git clone https://github.com/yoelbelay26/dunktime.git
cd dunktime
npm install
```

צור קובץ `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

---

## שירותים חיצוניים ואינטגרציות

| שירות | סוג | תפקיד במוצר |
|---|---|---|
| Supabase Auth | אוטנטיקציה | הרשמה וכניסה עם אימות מייל |
| Supabase Database (PostgreSQL) | מסד נתונים | משתמשים, מגרשים, משחקים, שחקנים, הודעות |
| Supabase Storage | אחסון קבצים | העלאת תמונות פרופיל |
| Supabase Realtime | WebSocket | הודעות צ'אט בזמן אמת |
| OpenStreetMap | מפות | תצוגת מפה של מגרשים בעיר |
| Waze Deep Link | ניווט | ניווט למגרש ישירות מהאפליקציה |
| Vercel | Hosting / CI-CD | פרסום האתר, דיפלוי אוטומטי מ-GitHub |
| Google Fonts (Rubik) | עיצוב | גופן עברי לכל האפליקציה |

---

## טבלאות מסד הנתונים (ERD)

| טבלה | עמודות עיקריות |
|---|---|
| `profiles` | id (FK → auth.users), full_name, avatar_url, city |
| `courts` | id, name, address, neighborhood, city, surface_type, has_lights |
| `games` | id, court_id (FK), created_by (FK), scheduled_date, scheduled_time, max_players, team_name, city, note |
| `game_players` | game_id (FK), user_id (FK) |
| `messages` | id, game_id (FK), user_id (FK), content, created_at |

> לתרשים ERD מלא: Supabase Dashboard → Database → Schema Visualizer

---

## סטק טכנולוגי

- **Frontend:** React 19, Vite 8, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Routing:** React Router v7
- **Deploy:** Vercel (CI/CD אוטומטי מ-GitHub)
- **Language:** Hebrew RTL
