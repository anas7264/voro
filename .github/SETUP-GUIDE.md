# 🚀 VORO Auto-Merge Bot - Setup Guide
> دليل التثبيت والإعدادات للـ Bot المرن

## 📋 المحتويات
- [البدء السريع](#البدء-السريع)
- [إعدادات البريد الإلكتروني](#إعدادات-البريد-الإلكتروني)
- [إعدادات GitHub Secrets](#إعدادات-github-secrets)
- [التفعيل والتشغيل](#التفعيل-والتشغيل)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🚀 البدء السريع

### ✅ ما تم إنشاؤه:

```
✅ Workflow الأساسي: flexible-auto-merge.yml
✅ Workflow متقدم: auto-merge-advanced.yml
✅ توثيق شامل: AUTO-MERGE-GUIDE.md
✅ إعدادات Bot: BOT-CONFIGURATION.md
```

### 🔧 الخطوات الأساسية:

1. **فعّل الـ Workflows** (يتم تلقائياً)
2. **أضف البريد الإلكتروني** (اختياري)
3. **جرّب مع PR** 

---

## 📧 إعدادات البريد الإلكتروني

### الخيار 1️⃣: Gmail (الأسهل)

#### الخطوة 1: تفعيل الـ App Password

1. اذهب: [Google Account Security](https://myaccount.google.com/security)
2. فعّل: **2-Step Verification**
3. اذهب: **App passwords**
4. اختر: **Mail** و **Windows Computer**
5. انسخ: كلمة السر (16 حرف)

#### الخطوة 2: أضف Secrets إلى GitHub

اذهب إلى: **Settings → Secrets and Variables → Actions**

أضف 3 secrets:

```yaml
EMAIL_USERNAME: your-email@gmail.com
EMAIL_PASSWORD: xxxx xxxx xxxx xxxx  # من Google
NOTIFICATION_EMAIL: your-email@gmail.com
```

#### الخطوة 3: التحقق

```yaml
server_address: smtp.gmail.com
server_port: 465
```

---

### الخيار 2️⃣: Outlook/Microsoft

#### الخطوة 1: الإعدادات

```yaml
server_address: smtp-mail.outlook.com
server_port: 587
encryption: tls
username: your-email@outlook.com
password: your-password
```

#### الخطوة 2: أضف Secrets

```yaml
EMAIL_USERNAME: your-email@outlook.com
EMAIL_PASSWORD: your-password
NOTIFICATION_EMAIL: your-email@outlook.com
```

---

### الخيار 3️⃣: SendGrid (الأفضل للـ Production)

#### الخطوة 1: إنشء حساب

1. اذهب: [SendGrid.com](https://sendgrid.com)
2. أنشئ حساب مجاني
3. تحقق من البريد

#### الخطوة 2: الحصول على API Key

1. اذهب: **Settings → API Keys**
2. أنشئ key جديد
3. انسخ الـ key

#### الخطوة 3: أضف Secrets

```yaml
SENDGRID_API_KEY: SG.your-api-key-here
NOTIFICATION_EMAIL: your-email@example.com
```

#### الخطوة 4: استخدام في Workflow

```yaml
- name: Send Email via SendGrid
  uses: pepipost/github-action-send-mail@v1
  with:
    api_key: ${{ secrets.SENDGRID_API_KEY }}
    to: ${{ secrets.NOTIFICATION_EMAIL }}
    subject: "PR Merged: ${{ github.event.pull_request.title }}"
```

---

## 🔑 إعدادات GitHub Secrets

### الطريقة الصحيحة:

#### الخطوة 1: اذهب للـ Settings

```
Repository → Settings → 
Secrets and variables → Actions
```

#### الخطوة 2: أضف Secrets

اضغط **"New repository secret"** وأضف:

| الاسم | القيمة | مثال |
|------|--------|------|
| `EMAIL_USERNAME` | بريدك الإلكتروني | user@gmail.com |
| `EMAIL_PASSWORD` | كلمة سر التطبيق | xxxx xxxx xxxx xxxx |
| `NOTIFICATION_EMAIL` | البريد المستقبل | admin@company.com |

#### ❌ لا تفعل:

```yaml
# ❌ خطير جداً - لا تكتب الـ secrets في الـ code
email_password: "my-password"  # لا تفعل هذا!
```

#### ✅ افعل:

```yaml
# ✅ استخدم Secrets الآمنة
password: ${{ secrets.EMAIL_PASSWORD }}
```

---

## ✅ التفعيل والتشغيل

### الطريقة 1: اختبار يدوي

```bash
# 1. أنشئ PR جديد
git checkout -b test-auto-merge
echo "test" > test.txt
git add .
git commit -m "test: auto-merge bot"
git push origin test-auto-merge

# 2. افتح PR على GitHub
# GitHub سيعرض الـ workflow تلقائياً
```

### الطريقة 2: عرض الـ Workflow

1. اذهب إلى: **Pull Requests** tab
2. اختر أي PR
3. انزل للأسفل لرؤية الـ checks
4. اضغط "Details" لرؤية التفاصيل

### الطريقة 3: مراقبة الـ Actions

```
Repository → Actions tab →
Advanced Auto-Merge Pipeline
(or Flexible Auto-Merge Bot)
```

---

## 🔄 كيف يعمل الـ Bot

### السيناريو الكامل:

```
┌─────────────────────────────┐
│ تم فتح/تحديث PR              │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│ 🏃 Quick Checks             │
│ (فحص سريع - بدون إيقاف)     │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│ ✅ Auto-Approve            │
│ (الموافقة التلقائية)        │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│ 🎯 Auto-Merge              │
│ (الـ Merge الفوري)          │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│ 📧 Send Email              │
│ (إرسال بريد تأكيد)          │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│ 💬 Success Comment         │
│ (تعليق النجاح)             │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│ 📋 Log Event               │
│ (تسجيل الحدث)             │
└─────────────────────────────┘
              ↓
         ✅ DONE!
```

---

## ⏱️ الأوقات المتوقعة

| المرحلة | الوقت |
|--------|------|
| 🏃 Quick Checks | ~5 ثوانٍ |
| ✅ Auto-Approve | ~2 ثانية |
| 🎯 Auto-Merge | ~3 ثوانٍ |
| 📧 Email | ~2 ثانية |
| 💬 Comment | ~2 ثانية |
| **المجموع** | **~14 ثانية** |

---

## 🐛 استكشاف الأخطاء

### المشكلة: البريد لم يصل

**الحلول:**
1. تحقق من الـ Secrets:
   ```
   Settings → Secrets → تحقق من القيم
   ```

2. شاهد الـ Logs:
   ```
   Pull Request → Actions → 
   Flexible Auto-Merge Bot → 
   send-confirmation-email → Logs
   ```

3. تجربة:
   - غيّر إلى Gmail
   - تأكد من App Password
   - حاول مع بريد آخر

### المشكلة: PR لم تُقبل

**الحل:**
1. شاهد الـ Workflow logs
2. ابحث عن الخطأ الفعلي
3. تحقق من:
   - هل الـ PR مفتوح؟
   - هل توجد conflicts؟
   - هل البيانات صحيحة؟

### المشكلة: Email timeout

**الحل:**
```yaml
# أضف timeout أطول
timeout-minutes: 5
```

---

## 🎨 تخصيص الرسائل

### تغيير نص البريد:

في الملف: `.github/workflows/flexible-auto-merge.yml`

ابحث عن:
```yaml
body: |
  🎉 تأكيد نجاح الـ Merge
```

غيّر النص كما تشاء.

### تغيير نص التعليق:

ابحث عن:
```yaml
body: `🎉 **تم الـ Merge بنجاح!**`
```

أضف أو عدّل كما تشاء.

---

## 🚀 أوامر مفيدة

### إعادة تشغيل Workflow:

```bash
# من واجهة GitHub:
1. اذهب للـ Actions tab
2. اختر الـ Workflow
3. اضغط "Re-run all jobs"
```

### عرض السجلات:

```bash
# من Terminal:
gh run list --repo anas7264/voro
gh run view <run-id> --log
```

### إيقاف Bot مؤقتاً:

```yaml
# أضف label: do-not-merge
```

---

## 📊 مراقبة الـ Bot

### Dashboard بسيط:

```
Repository → Actions → 
Advanced Auto-Merge Pipeline
```

تشاهد:
- ✅ Passing workflows
- ❌ Failed workflows
- ⏱️ Execution time
- 📊 Success rate

---

## 🎯 Best Practices

### ✅ افعل:

```
✅ اختبر البريد أولاً
✅ استخدم secrets آمنة
✅ راقب السجلات
✅ عدّل الرسائل حسب احتياجك
✅ احذر من غسيل البريد
```

### ❌ تجنب:

```
❌ لا تكتب الـ passwords في الـ code
❌ لا تستخدم بريد شخصي لـ production
❌ لا تتجاهل أخطاء الـ workflow
❌ لا تترك الـ secrets مكشوفة
```

---

## 🔒 الأمان

### إخفاء الـ Secrets:

GitHub يخفيها تلقائياً في الـ logs:

```yaml
# GitHub يعرض هكذا:
password: ***
email: ***
```

لكن يمكنك:
```bash
# لا تطبع الـ secrets
echo "This is secret: ${{ secrets.EMAIL_PASSWORD }}"  # ❌
```

### الطريقة الآمنة:

```yaml
# ✅ استخدم في الخطوات فقط
- name: Send Email
  run: |
    send_mail --password "${{ secrets.EMAIL_PASSWORD }}"
```

---

## 📞 الدعم

### إذا واجهت مشكلة:

1. **شاهد الـ Logs**: Actions → Run details
2. **ابحث عن الخطأ**: في كل step
3. **جرّب بريد مختلف**: غيّر الـ provider
4. **استشر التوثيق**: README أو Issues
5. **أنشئ Issue**: اشرح المشكلة بالتفصيل

---

## 📚 الملفات المرتبطة

```
.github/
├── workflows/
│   ├── auto-merge-advanced.yml      ← متقدم مع فحوصات
│   └── flexible-auto-merge.yml      ← مرن بدون شروط
├── AUTO-MERGE-GUIDE.md              ← دليل شامل
├── BOT-CONFIGURATION.md             ← إعدادات Bot
└── SETUP-GUIDE.md                   ← هذا الملف
```

---

## 🎉 النتيجة النهائية

بعد الإعدادات الكاملة:

✅ **Auto-Merge فوري** (10-15 ثانية)  
✅ **الموافقة التلقائية** (بدون تدخل يدوي)  
✅ **بريد تأكيد** (لكل merge)  
✅ **تعليق تلقائي** (في PR)  
✅ **حذف الفرع** (تلقائي)  
✅ **سجل كامل** (للمراقبة)  

---

**آخر تحديث:** 2026-08-21  
**الإصدار:** 2.0  
**الحالة:** ✅ جاهز للاستخدام  
**الدعم:** ✅ متوفر
