# Auto-Merge Configuration Guide
> دليل شامل لنظام الـ Auto-Merge الذكي في مشروع VORO

## 📋 المحتويات
- [نظرة عامة](#نظرة-عامة)
- [كيفية التفعيل](#كيفية-التفعيل)
- [آلية العمل](#آلية-العمل)
- [القواعد والشروط](#القواعد-والشروط)
- [الـ Labels والتحكم](#labels-والتحكم)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🚀 نظرة عامة

هذا النظام يوفر:

| الميزة | الوصف |
|--------|--------|
| ⚡ **السرعة** | Merge في أقل من 30 ثانية |
| 🔒 **الأمان** | فحوصات أمان وجودة شاملة |
| 🧠 **ذكي** | يحلل حجم التغييرات والملفات |
| 📊 **شامل** | اختبارات، بناء، وفحوصات أمان |
| 🤖 **تلقائي تماماً** | بدون تدخل يدوي |

---

## 🔧 كيفية التفعيل

### الخطوة 1️⃣: تفعيل الـ Workflow

الملف موجود بالفعل في:
```
.github/workflows/auto-merge-advanced.yml
```

✅ يتم تفعيله تلقائياً عند أي PR جديد

### الخطوة 2️⃣: تكوين Branch Protection (اختياري لكن موصى به)

اذهب إلى: **Settings → Branches → Branch protection rules**

أضف القواعد التالية للـ `main` branch:

```
✅ Require a pull request before merging
✅ Dismiss stale pull request approvals when new commits are pushed
✅ Require code reviews before merging (0 if using auto-merge)
✅ Require status checks to pass before merging
   - build-verification
   - test-verification
   - security-checks
   - smart-analysis
```

### الخطوة 3️⃣: تعطيل الـ Reviews اليدوية (اختياري)

إذا كنت تثق في الـ Bot بالكامل:
```
Settings → Pull Requests → 
Uncheck "Require pull request reviews before merging"
```

---

## 🔄 آلية العمل

```
┌─────────────────────────────────────────────┐
│  PR Created/Updated                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 🔨 Build Verification                       │
│   - Install dependencies (pnpm)             │
│   - Run: npm run build                       │
│   - Timeout: 10 minutes                      │
└─────────────────────────────────────────────┘
                    ↓
        ┌─────────────┬──────────────┐
        ↓             ↓              ↓
    ✅ Build      ⚠️ Warning    ❌ Failed
    Success      (Continues)    (Stop)
        │             │              │
        └─────────────┴──────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 🧪 Test Verification                        │
│   - Install Playwright                      │
│   - Run tests                                │
│   - Analyze results                          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 🔒 Security & Code Quality                  │
│   - Check for exposed credentials           │
│   - Verify lockfile                          │
│   - Run ESLint (if configured)               │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 🧠 Smart Analysis                           │
│   - Check file count (MAX: 100)              │
│   - Check lines changed (MAX: 5000)          │
│   - Check for 'blocked' label                │
│   - Check base branch                        │
└─────────────────────────────────────────────┘
                    ↓
        ┌─────────────┬──────────────┐
        ↓             ↓
    ✅ PASS      ❌ FAIL
        │             │
        ↓             ↓
    Auto-Approve  Add 'needs-review'
        │             │
        ↓             ↓
    Auto-Merge    Stop Process
        │
        ↓
    🗑️ Delete Branch
        │
        ↓
    🎉 Close PR + Comment
```

---

## ✅ القواعس والشروط

### الشروط الإجبارية للـ Merge:

| الشرط | القيمة | الإجراء |
|-------|--------|--------|
| 🏗️ Build Status | ✅ Success | يجب نجاح البناء |
| 🧪 Tests | ✅ Passed | اختبارات Playwright تمر |
| 🔒 Security | ✅ Clear | لا توجد بيانات حساسة |
| 📊 File Count | ≤ 100 | تحذير إذا تجاوز 100 ملف |
| 📝 Lines Changed | ≤ 5000 | تحذير إذا تجاوز 5000 سطر |
| 🏷️ Labels | ❌ blocked | يجب عدم وجود label "blocked" |
| 🏷️ Labels | ❌ do-not-merge | يجب عدم وجود label "do-not-merge" |
| 🌿 Base Branch | main/develop | فقط للأفرع الرئيسية |

### أمثلة على السيناريوهات:

#### ✅ تمام - سيتم Merge:
```
- Build: PASSED ✅
- Tests: PASSED ✅
- Security: CLEAR ✅
- Files: 45 ✅
- Labels: none ✅
→ Auto-Merge في ~15 ثانية
```

#### ⚠️ تحذير - يحتاج review:
```
- Build: PASSED ✅
- Tests: PASSED ✅
- Security: CLEAR ✅
- Files: 150 ⚠️ (يتجاوز 100)
- Labels: none ✅
→ يضيف label "needs-review" + تعليق
```

#### ❌ رفض - لن يتم Merge:
```
- Build: FAILED ❌
→ يتوقف الـ workflow فوراً
```

---

## 🏷️ Labels والتحكم

### Labels المدعومة:

#### 🚫 حظر الـ Merge:
```yaml
do-not-merge    # منع أي merge تلقائي
blocked         # PR مقفولة
wip             # Work In Progress
hold            # انتظر التحديثات
```

#### ⚠️ تحذيرات:
```yaml
needs-review    # يحتاج review يدوي (تضاف تلقائياً)
large-pr        # PR كبيرة
security        # مشاكل أمان
```

#### ✅ تسريع:
```yaml
auto-merge      # فوري جداً (اختياري)
urgent          # أولوية عالية
hotfix          # إصلاح عاجل
```

### كيفية الاستخدام:

أضف أي label عند فتح PR:

```bash
# من GitHub UI:
# 1. اذهب للـ PR
# 2. اضغط Labels على اليمين
# 3. اختر الـ label المطلوب
```

---

## 📊 مراقبة الـ Workflow

### مشاهدة حالة الـ Workflow:

1. **اذهب للـ PR** → اسفل الصفحة
2. **شاهد الـ checks**: 
   ```
   ✅ build-verification
   ✅ test-verification
   ✅ security-checks
   ✅ smart-analysis
   ✅ auto-approve
   ✅ auto-merge
   ```

3. **اضغط على "Details"** لرؤية التفاصيل

### عرض السجلات الكاملة:

1. اذهب إلى: **Actions** tab
2. اختر: **Advanced Auto-Merge Pipeline**
3. اختر آخر run
4. شاهد كل step بالتفصيل

---

## 🐛 استكشاف الأخطاء

### المشكلة: PR لم تُقبل تلقائياً

**الحل:**
1. شاهد **Workflow logs** في Actions tab
2. ابحث عن الـ step الذي فشل
3. تحقق من:
   - هل الـ build يمر؟
   - هل الاختبارات تمر؟
   - هل هناك labels تحظر الـ merge؟

### المشكلة: Build فشل

**الحل:**
```bash
# جرب البناء محلياً:
cd webs
pnpm install
pnpm run build
```

### المشكلة: Tests فشلت

**الحل:**
```bash
# جرب الاختبارات محلياً:
cd webs
pnpm exec playwright install
pnpm exec playwright test
```

### المشكلة: Security warning

**الحل:**
- تأكد من عدم وجود `password`, `api_key`, `secret` في الـ code
- استخدم environment variables بدلاً منها

---

## ⚙️ التخصيص

### تعديل حدود الملفات:

عدّل الـ file في:
```
.github/workflows/auto-merge-advanced.yml
```

ابحث عن:
```yaml
if [ "$CHANGED_FILES" -gt 100 ]; then
```

غيّر `100` إلى القيمة المطلوبة.

### تعديل حدود الأسطر:

ابحث عن:
```yaml
elif [ "$CHANGED_LINES" -gt 5000 ]; then
```

غيّر `5000` إلى القيمة المطلوبة.

### إضافة فحوصات إضافية:

عدّل الـ `smart-analysis` job لإضافة شروط جديدة.

---

## 📈 الإحصائيات والتقارير

### ما الذي يحسبه الـ Bot:

```bash
# عدد الملفات المتغيرة
CHANGED_FILES=$(git diff --name-only origin/main... | wc -l)

# عدد الأسطر المضافة
CHANGED_LINES=$(git diff --shortstat origin/main... | awk '{print $4}')

# حجم الـ PR
SIZE = CHANGED_FILES + CHANGED_LINES
```

### عرض التقارير:

اضغط على **Summary** في GitHub Actions لرؤية التقارير.

---

## 🎯 Best Practices

### ✅ أفضل الممارسات:

```
1. اجعل PRs صغيرة (< 100 ملف)
2. اكتب رسائل commit واضحة
3. جرّب البناء محلياً قبل Push
4. اجعل البناء سريعاً (< 2 دقيقة)
5. أضف اختبارات Playwright
```

### ❌ ما تجنبه:

```
1. PRs ضخمة جداً (> 5000 سطر)
2. ملفات بيانات حساسة
3. Merge conflicts معقدة
4. Dependencies قديمة
```

---

## 🚀 أوامر مفيدة

### إعادة تشغيل الـ Workflow:

```bash
# من GitHub UI:
# 1. اذهب للـ PR
# 2. اضغط "Actions"
# 3. اختر الـ workflow
# 4. اضغط "Re-run all jobs"
```

### Skip Auto-Merge مؤقتاً:

أضف label `do-not-merge` للـ PR

### Force Merge يدوي:

```bash
# من GitHub UI:
# اضغط زرار "Merge" أسفل PR
# اختر "Squash and merge"
```

---

## 📞 الدعم والمساعدة

إذا واجهت مشاكل:

1. **شاهد الـ Logs**: Actions → workflow logs
2. **تحقق من البناء محلياً**: `pnpm run build`
3. **شاهل الـ Dependencies**: `pnpm list`
4. **اسأل في Issues**: أنشئ issue جديد

---

## 📝 الملفات الرئيسية

```
.github/
├── workflows/
│   └── auto-merge-advanced.yml  ← الـ workflow الرئيسي
└── README.md                     ← هذا الملف
```

---

**آخر تحديث:** 2026-08-21  
**الإصدار:** 1.0  
**الحالة:** ✅ نشط
