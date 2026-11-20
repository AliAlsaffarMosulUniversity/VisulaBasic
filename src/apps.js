/* ===== تصميمات: تطبيقات صغيرة جميلة بعد إنهاء المنهج ===== */
(function () {
const grid = (rows, x0, y0, w, h, gap, opt) => { const out = []; rows.forEach((r, ri) => r.forEach((c, ci) => { if (c) out.push(C(c[0], c[1], x0 + ci * (w + gap), y0 + ri * (h + gap), w, h, Object.assign({ fontsize: 12, fontbold: true }, opt || {}, c[2] || {}))); })); return out; };

ex('app_calc', 'apps', 'الآلة الحاسبة Calculator', 'آلة حاسبة كاملة بأزرار الأرقام، مثل حاسبة Windows.',
  F('Calculator', 262, 352, [
    L('Label1', '', 12, 8, 238, 18, { alignment: 1, forecolor: 8421504 }),
    T('Text1', '0', 12, 28, 238, 36, { alignment: 1, fontsize: 18, fontbold: true, locked: true }),
  ].concat(grid([
    [['cmdClear', 'C', { forecolor: 255 }], ['cmdBack', '←'], ['cmdSqr', '√'], ['cmdDiv', '/']],
    [['Command7', '7'], ['Command8', '8'], ['Command9', '9'], ['cmdMul', '*']],
    [['Command4', '4'], ['Command5', '5'], ['Command6', '6'], ['cmdSub', '-']],
    [['Command1', '1'], ['Command2', '2'], ['Command3', '3'], ['cmdAdd', '+']],
    [['cmdSign', '±'], ['Command0', '0'], ['cmdDot', '.'], ['cmdEq', '=', { default: true, forecolor: 16711680 }]]
  ], 12, 76, 55, 46, 6))),
  String.raw`
Option Explicit
Dim first As Double
Dim op As String
Dim fresh As Boolean

Private Sub Digit(d As String)
If fresh Or Text1.Text = "0" Then
Text1.Text = d
fresh = False
Else
Text1.Text = Text1.Text & d
End If
End Sub

Private Sub SetOp(o As String)
first = Val(Text1.Text)
op = o
fresh = True
Label1.Caption = first & " " & o
End Sub

Private Sub Command0_Click()
Digit "0"
End Sub
Private Sub Command1_Click()
Digit "1"
End Sub
Private Sub Command2_Click()
Digit "2"
End Sub
Private Sub Command3_Click()
Digit "3"
End Sub
Private Sub Command4_Click()
Digit "4"
End Sub
Private Sub Command5_Click()
Digit "5"
End Sub
Private Sub Command6_Click()
Digit "6"
End Sub
Private Sub Command7_Click()
Digit "7"
End Sub
Private Sub Command8_Click()
Digit "8"
End Sub
Private Sub Command9_Click()
Digit "9"
End Sub

Private Sub cmdAdd_Click()
SetOp "+"
End Sub
Private Sub cmdSub_Click()
SetOp "-"
End Sub
Private Sub cmdMul_Click()
SetOp "*"
End Sub
Private Sub cmdDiv_Click()
SetOp "/"
End Sub

Private Sub cmdEq_Click()
Dim second As Double, r As Double
If op = "" Then Exit Sub
second = Val(Text1.Text)
Select Case op
Case "+"
r = first + second
Case "-"
r = first - second
Case "*"
r = first * second
Case "/"
If second = 0 Then
MsgBox "Cannot divide by zero", 16, "Calculator"
Exit Sub
End If
r = first / second
End Select
Label1.Caption = first & " " & op & " " & second & " ="
Text1.Text = r
op = ""
fresh = True
End Sub

Private Sub cmdDot_Click()
If fresh Then
Text1.Text = "0."
fresh = False
ElseIf InStr(Text1.Text, ".") = 0 Then
Text1.Text = Text1.Text & "."
End If
End Sub

Private Sub cmdSign_Click()
Text1.Text = -Val(Text1.Text)
End Sub

Private Sub cmdSqr_Click()
If Val(Text1.Text) < 0 Then
MsgBox "Negative number", 48, "Calculator"
Else
Label1.Caption = "Sqr(" & Text1.Text & ")"
Text1.Text = Sqr(Val(Text1.Text))
fresh = True
End If
End Sub

Private Sub cmdBack_Click()
If Len(Text1.Text) > 1 Then
Text1.Text = Left(Text1.Text, Len(Text1.Text) - 1)
Else
Text1.Text = "0"
End If
End Sub

Private Sub cmdClear_Click()
Text1.Text = "0"
Label1.Caption = ""
first = 0
op = ""
End Sub`);

ex('app_bmi', 'apps', 'حاسبة كتلة الجسم BMI', 'أدخل الوزن والطول، فيحسب مؤشر كتلة الجسم ويلوّن النتيجة حسب الفئة.',
  F('BMI Calculator', 320, 260, [
    L('Label1', 'BMI Calculator', 10, 8, 300, 26, { alignment: 2, fontsize: 14, fontbold: true, forecolor: 8388608 }),
    L('Label2', 'Weight (kg)', 20, 48, 100), T('Text1', '70', 130, 45, 160),
    L('Label3', 'Height (cm)', 20, 80, 100), T('Text2', '175', 130, 77, 160),
    C('Command1', 'Calculate', 30, 115, 120, 30, { default: true }), C('Command2', 'Clear', 170, 115, 120, 30),
    L('Label4', '', 20, 160, 280, 34, { alignment: 2, fontsize: 16, fontbold: true, borderstyle: 1 }),
    L('Label5', '', 20, 200, 280, 30, { alignment: 2, fontsize: 12, fontbold: true, borderstyle: 1 })]),
  String.raw`
Private Sub Command1_Click()
Dim w As Single, h As Single, bmi As Single
w = Val(Text1.Text)
h = Val(Text2.Text) / 100
If w <= 0 Or h <= 0 Then
MsgBox "Enter a valid weight and height", 48, "BMI"
Exit Sub
End If
bmi = w / (h * h)
Label4.Caption = "BMI = " & Format(bmi, "0.0")
If bmi < 18.5 Then
Label5.Caption = "Underweight"
Label5.BackColor = RGB(173, 216, 230)
ElseIf bmi < 25 Then
Label5.Caption = "Normal"
Label5.BackColor = RGB(144, 238, 144)
ElseIf bmi < 30 Then
Label5.Caption = "Overweight"
Label5.BackColor = RGB(255, 200, 100)
Else
Label5.Caption = "Obese"
Label5.BackColor = RGB(255, 120, 120)
End If
End Sub

Private Sub Command2_Click()
Text1.Text = ""
Text2.Text = ""
Label4.Caption = ""
Label5.Caption = ""
Label5.BackColor = RGB(212, 208, 200)
Text1.SetFocus
End Sub`);

ex('app_temp', 'apps', 'محوّل درجات الحرارة', 'يحوّل بين المئوي Celsius والفهرنهايت Fahrenheit، ويعرض وجهًا يعبّر عن الجو.',
  F('Temperature', 320, 230, [
    L('Label1', 'Temperature Converter', 10, 8, 300, 26, { alignment: 2, fontsize: 13, fontbold: true, forecolor: 255 }),
    L('Label2', 'Degree', 20, 50, 70), T('Text1', '30', 95, 47, 120, 26, { fontsize: 12 }),
    IM('Image1', '🌡️', 235, 40, 60, 60),
    C('Command1', '°C → °F', 20, 95, 130, 30), C('Command2', '°F → °C', 165, 95, 130, 30),
    L('Label3', '', 20, 145, 280, 34, { alignment: 2, fontsize: 15, fontbold: true, borderstyle: 1, backcolor: 16777215 })]),
  String.raw`
Private Sub Mood(c As Single)
If c < 10 Then
Image1.Picture = LoadPicture("cold")
ElseIf c < 30 Then
Image1.Picture = LoadPicture("warm")
Else
Image1.Picture = LoadPicture("hot")
End If
End Sub

Private Sub Command1_Click()
Dim c As Single, f As Single
c = Val(Text1.Text)
f = c * 9 / 5 + 32
Label3.Caption = c & " °C = " & Format(f, "0.0") & " °F"
Mood c
End Sub

Private Sub Command2_Click()
Dim c As Single, f As Single
f = Val(Text1.Text)
c = (f - 32) * 5 / 9
Label3.Caption = f & " °F = " & Format(c, "0.0") & " °C"
Mood c
End Sub`);

ex('app_currency', 'apps', 'محوّل العملات (دولار ↔ دينار)', 'يحوّل بين الدولار والدينار العراقي بسعر صرف تكتبه أنت.',
  F('Currency', 330, 250, [
    L('Label1', 'USD ⇄ IQD', 10, 8, 310, 26, { alignment: 2, fontsize: 14, fontbold: true, forecolor: 32768 }),
    L('Label2', 'Rate (1 $ =)', 20, 48, 100), T('Text1', '1310', 130, 45, 170),
    L('Label3', 'Amount', 20, 80, 100), T('Text2', '100', 130, 77, 170),
    C('Command1', '$ → IQD', 20, 115, 140, 30), C('Command2', 'IQD → $', 170, 115, 140, 30),
    L('Label4', '', 20, 165, 290, 36, { alignment: 2, fontsize: 14, fontbold: true, borderstyle: 1, backcolor: 15794160 })]),
  String.raw`
Private Sub Command1_Click()
Dim rate As Double, a As Double
rate = Val(Text1.Text)
a = Val(Text2.Text)
Label4.Caption = Format(a, "#,##0.00") & " $ = " & Format(a * rate, "#,##0") & " IQD"
End Sub

Private Sub Command2_Click()
Dim rate As Double, a As Double
rate = Val(Text1.Text)
a = Val(Text2.Text)
If rate = 0 Then
MsgBox "Enter the exchange rate", 48, "Currency"
Exit Sub
End If
Label4.Caption = Format(a, "#,##0") & " IQD = " & Format(a / rate, "#,##0.00") & " $"
End Sub`);

ex('app_invoice', 'apps', 'فاتورة مبيعات', 'أضف المواد واحدة بعد الأخرى. يحسب المجموع، ويعطي خصم 10% إذا تجاوز 100,000 دينار.',
  F('Sales Invoice', 360, 380, [
    L('Label1', 'Item', 15, 12, 60), T('Text1', 'Pen', 80, 9, 265),
    L('Label2', 'Price', 15, 44, 60), T('Text2', '1500', 80, 41, 100),
    L('Label3', 'Qty', 195, 44, 40), T('Text3', '10', 240, 41, 105),
    C('Command1', 'Add item', 15, 76, 105, 28, { default: true }), C('Command2', 'Total', 128, 76, 105, 28), C('Command3', 'New invoice', 240, 76, 105, 28),
    L('Label4', 'Items: 0', 15, 112, 160, 20, { fontbold: true }),
    L('Label5', '', 15, 300, 330, 60, { borderstyle: 1, fontsize: 10, fontbold: true, backcolor: 16777215 })], { printTop: 136 }),
  String.raw`
Option Explicit
Dim total As Double
Dim count As Integer

Private Sub Command1_Click()
Dim price As Double, qty As Integer, line As Double
If Text1.Text = "" Or Val(Text2.Text) <= 0 Or Val(Text3.Text) <= 0 Then
MsgBox "Enter item, price and quantity", 48, "Invoice"
Exit Sub
End If
price = Val(Text2.Text)
qty = Val(Text3.Text)
line = price * qty
total = total + line
count = count + 1
Print count; ") "; Text1.Text; " "; qty; " x "; price; " = "; line
Label4.Caption = "Items: " & count
Text1.Text = ""
Text2.Text = ""
Text3.Text = "1"
Text1.SetFocus
End Sub

Private Sub Command2_Click()
Dim disc As Double
If total > 100000 Then disc = total * 0.1
Label5.Caption = "Total: " & Format(total, "#,##0") & "   Discount: " & Format(disc, "#,##0") & vbCrLf & "To pay: " & Format(total - disc, "#,##0") & " IQD"
End Sub

Private Sub Command3_Click()
If MsgBox("Start a new invoice?", 4 + 32, "Invoice") = vbYes Then
total = 0
count = 0
Cls
Label4.Caption = "Items: 0"
Label5.Caption = ""
End If
End Sub`);

ex('app_salary', 'apps', 'حاسبة الراتب الصافي', 'الراتب الأساسي + المخصصات − الضريبة. نسبة الضريبة تتغير حسب الراتب (Select Case).',
  F('Salary', 330, 300, [
    L('Label1', 'Net Salary Calculator', 10, 8, 310, 26, { alignment: 2, fontsize: 13, fontbold: true, forecolor: 8388608 }),
    L('Label2', 'Basic salary', 20, 48, 110), T('Text1', '750000', 140, 45, 165),
    L('Label3', 'Allowances', 20, 80, 110), T('Text2', '150000', 140, 77, 165),
    C('Command1', 'Calculate', 20, 115, 140, 30, { default: true }), C('Command2', 'Clear', 170, 115, 135, 30),
    L('Label4', 'Gross', 20, 165, 110), T('Text3', '', 140, 162, 165, 22, { locked: true, backcolor: 14737632 }),
    L('Label5', 'Tax', 20, 197, 110), T('Text4', '', 140, 194, 165, 22, { locked: true, backcolor: 14737632 }),
    L('Label6', 'Net salary', 20, 229, 110, 20, { fontbold: true }), T('Text5', '', 140, 226, 165, 24, { locked: true, fontbold: true, backcolor: 13434828 })]),
  String.raw`
Private Sub Command1_Click()
Dim gross As Double, rate As Double, tax As Double
gross = Val(Text1.Text) + Val(Text2.Text)
Select Case gross
Case Is <= 250000
rate = 0
Case Is <= 500000
rate = 0.03
Case Is <= 1000000
rate = 0.05
Case Else
rate = 0.1
End Select
tax = gross * rate
Text3.Text = Format(gross, "#,##0")
Text4.Text = Format(tax, "#,##0") & "  (" & rate * 100 & "%)"
Text5.Text = Format(gross - tax, "#,##0") & " IQD"
End Sub

Private Sub Command2_Click()
Text1.Text = ""
Text2.Text = ""
Text3.Text = ""
Text4.Text = ""
Text5.Text = ""
Text1.SetFocus
End Sub`);

ex('app_guess', 'apps', 'لعبة تخمين الرقم', 'الحاسوب يختار رقمًا سرّيًا من 1 إلى 100. خمّنه بأقل عدد من المحاولات.',
  F('Guess the Number', 320, 270, [
    L('Label1', 'I picked a number from 1 to 100', 10, 10, 300, 24, { alignment: 2, fontsize: 11, fontbold: true }),
    IM('Image1', '🤔', 130, 38, 60, 60),
    T('Text1', '', 90, 108, 140, 30, { alignment: 2, fontsize: 14 }),
    C('Command1', 'Guess', 40, 150, 110, 30, { default: true }), C('Command2', 'New game', 170, 150, 110, 30),
    L('Label2', '', 20, 195, 280, 28, { alignment: 2, fontsize: 13, fontbold: true }),
    L('Label3', 'Tries: 0', 20, 228, 280, 20, { alignment: 2 })]),
  String.raw`
Option Explicit
Dim secret As Integer
Dim tries As Integer

Private Sub NewGame()
Randomize
secret = Int(Rnd * 100) + 1
tries = 0
Label2.Caption = "Type a number and press Guess"
Label2.ForeColor = vbBlack
Label3.Caption = "Tries: 0"
Image1.Picture = LoadPicture("think")
Text1.Text = ""
Command1.Enabled = True
End Sub

Private Sub Form_Load()
NewGame
End Sub

Private Sub Command1_Click()
Dim g As Integer
g = Val(Text1.Text)
If g < 1 Or g > 100 Then
MsgBox "Enter a number from 1 to 100", 48, "Guess"
Exit Sub
End If
tries = tries + 1
Label3.Caption = "Tries: " & tries
If g < secret Then
Label2.Caption = g & " is too small ⬆"
Label2.ForeColor = vbBlue
ElseIf g > secret Then
Label2.Caption = g & " is too big ⬇"
Label2.ForeColor = vbRed
Else
Label2.Caption = "Correct! It is " & secret
Label2.ForeColor = RGB(0, 140, 0)
Image1.Picture = LoadPicture("happy")
Command1.Enabled = False
MsgBox "You won in " & tries & " tries", 64, "Bravo"
End If
Text1.Text = ""
End Sub

Private Sub Command2_Click()
NewGame
End Sub`);

ex('app_rps', 'apps', 'لعبة حجر ورقة مقص', 'اختر حركتك، والحاسوب يختار عشوائيًا. البرنامج يحدد الفائز ويحسب النقاط.',
  F('Rock Paper Scissors', 330, 290, [
    L('Label1', 'You', 30, 10, 100, 20, { alignment: 2, fontbold: true }), L('Label2', 'Computer', 200, 10, 100, 20, { alignment: 2, fontbold: true }),
    IM('Image1', '❔', 45, 32, 70, 70), L('Label3', 'VS', 140, 55, 50, 26, { alignment: 2, fontsize: 14, fontbold: true, forecolor: 255 }), IM('Image2', '❔', 215, 32, 70, 70),
    C('Command1', 'Rock ✊', 15, 120, 95, 32), C('Command2', 'Paper ✋', 117, 120, 95, 32), C('Command3', 'Scissors ✌️', 219, 120, 95, 32),
    L('Label4', 'Choose your move', 15, 168, 300, 30, { alignment: 2, fontsize: 14, fontbold: true }),
    L('Label5', 'You 0 : 0 Computer', 15, 205, 300, 24, { alignment: 2, fontsize: 12, borderstyle: 1 }),
    C('Command4', 'Reset score', 110, 240, 110, 28)]),
  String.raw`
Option Explicit
Dim me1 As Integer
Dim pc As Integer

Private Function Pic(m As Integer) As String
Select Case m
Case 1
Pic = "rock"
Case 2
Pic = "paper"
Case 3
Pic = "scissors"
End Select
End Function

Private Sub Play(you As Integer)
Dim comp As Integer
comp = Int(Rnd * 3) + 1
Image1.Picture = LoadPicture(Pic(you))
Image2.Picture = LoadPicture(Pic(comp))
If you = comp Then
Label4.Caption = "Draw"
Label4.ForeColor = vbBlack
ElseIf (you = 1 And comp = 3) Or (you = 2 And comp = 1) Or (you = 3 And comp = 2) Then
Label4.Caption = "You win!"
Label4.ForeColor = RGB(0, 140, 0)
me1 = me1 + 1
Else
Label4.Caption = "Computer wins"
Label4.ForeColor = vbRed
pc = pc + 1
End If
Label5.Caption = "You " & me1 & " : " & pc & " Computer"
End Sub

Private Sub Command1_Click()
Play 1
End Sub

Private Sub Command2_Click()
Play 2
End Sub

Private Sub Command3_Click()
Play 3
End Sub

Private Sub Command4_Click()
me1 = 0
pc = 0
Label5.Caption = "You 0 : 0 Computer"
Label4.Caption = "Choose your move"
End Sub`);

ex('app_table', 'apps', 'جدول الضرب', 'اكتب رقمًا فيطبع البرنامج جدول ضربه من 1 إلى 10 باستخدام الحلقة For.',
  F('Multiplication Table', 300, 330, [
    L('Label1', 'Number', 20, 15, 70), T('Text1', '7', 90, 12, 60, 24, { alignment: 2, fontsize: 12 }),
    C('Command1', 'Show', 160, 10, 60, 28, { default: true }), C('Command2', 'Clear', 228, 10, 60, 28)], { printTop: 52 }),
  String.raw`
Private Sub Command1_Click()
Dim n As Integer, i As Integer
n = Val(Text1.Text)
Cls
For i = 1 To 10
Print n; " x "; i; " = "; n * i
Next i
End Sub

Private Sub Command2_Click()
Cls
Text1.Text = ""
Text1.SetFocus
End Sub`);

ex('app_traffic', 'apps', 'إشارة المرور', 'كل ضغطة على Next تنقل الإشارة: أحمر ← أخضر ← أصفر ← أحمر.',
  F('Traffic Light', 260, 330, [
    L('Label9', '', 85, 10, 90, 245, { backcolor: 3289650, borderstyle: 1 }),
    L('Label1', '', 100, 22, 60, 60, { backcolor: 4210752, borderstyle: 1 }),
    L('Label2', '', 100, 102, 60, 60, { backcolor: 4210752, borderstyle: 1 }),
    L('Label3', '', 100, 182, 60, 60, { backcolor: 4210752, borderstyle: 1 }),
    L('Label4', '', 10, 262, 240, 24, { alignment: 2, fontsize: 13, fontbold: true }),
    C('Command1', 'Next ▶', 80, 292, 100, 28, { default: true })]),
  String.raw`
Option Explicit
Dim state As Integer

Private Sub ShowLight()
Label1.BackColor = RGB(64, 64, 64)
Label2.BackColor = RGB(64, 64, 64)
Label3.BackColor = RGB(64, 64, 64)
Select Case state
Case 0
Label1.BackColor = vbRed
Label4.Caption = "STOP"
Label4.ForeColor = vbRed
Case 1
Label3.BackColor = vbGreen
Label4.Caption = "GO"
Label4.ForeColor = RGB(0, 140, 0)
Case 2
Label2.BackColor = vbYellow
Label4.Caption = "READY"
Label4.ForeColor = RGB(200, 150, 0)
End Select
End Sub

Private Sub Form_Load()
state = 0
ShowLight
End Sub

Private Sub Command1_Click()
state = state + 1
If state > 2 Then state = 0
ShowLight
End Sub`);

ex('app_quiz', 'apps', 'تطبيق اختبار (Quiz)', 'خمسة أسئلة عن Visual Basic. اختر الجواب، والبرنامج يصحح ويعطيك الدرجة في النهاية.',
  F('VB Quiz', 340, 300, [
    L('Label1', '', 10, 8, 320, 20, { fontbold: true, forecolor: 8388608 }),
    L('Label2', '', 10, 32, 320, 50, { fontsize: 12, fontbold: true, borderstyle: 1, backcolor: 16777215 }),
    C('Command1', '', 20, 95, 300, 30), C('Command2', '', 20, 133, 300, 30), C('Command3', '', 20, 171, 300, 30),
    L('Label3', '', 10, 212, 320, 24, { alignment: 2, fontsize: 12, fontbold: true }),
    C('Command4', 'Start again', 110, 250, 120, 28, { visible: false })]),
  String.raw`
Option Explicit
Dim q As Integer
Dim answer As Integer
Dim score As Integer

Private Sub ShowQ()
Label1.Caption = "Question " & q & " of 5     Score: " & score
Select Case q
Case 1
Label2.Caption = "Which property shows the text of a Label?"
Command1.Caption = "Text"
Command2.Caption = "Caption"
Command3.Caption = "Name"
answer = 2
Case 2
Label2.Caption = "Which function changes text to a number?"
Command1.Caption = "Val"
Command2.Caption = "Len"
Command3.Caption = "Str"
answer = 1
Case 3
Label2.Caption = "Which statement declares a variable?"
Command1.Caption = "Const"
Command2.Caption = "Print"
Command3.Caption = "Dim"
answer = 3
Case 4
Label2.Caption = "MsgBox returns 6 when the user presses:"
Command1.Caption = "Yes"
Command2.Caption = "No"
Command3.Caption = "Cancel"
answer = 1
Case 5
Label2.Caption = "Which event runs when the form opens?"
Command1.Caption = "Click"
Command2.Caption = "Form_Load"
Command3.Caption = "Change"
answer = 2
Case Else
Label1.Caption = "Finished"
Label2.Caption = "Your score: " & score & " / 5"
Command1.Visible = False
Command2.Visible = False
Command3.Visible = False
Command4.Visible = True
If score >= 3 Then
Label3.Caption = "Passed 🎉"
Else
Label3.Caption = "Try again"
End If
End Select
End Sub

Private Sub Check(c As Integer)
If c = answer Then
score = score + 1
Label3.Caption = "Correct ✔"
Label3.ForeColor = RGB(0, 140, 0)
Else
Label3.Caption = "Wrong ✘"
Label3.ForeColor = vbRed
End If
q = q + 1
ShowQ
End Sub

Private Sub Form_Load()
q = 1
score = 0
Label3.Caption = ""
ShowQ
End Sub

Private Sub Command1_Click()
Check 1
End Sub

Private Sub Command2_Click()
Check 2
End Sub

Private Sub Command3_Click()
Check 3
End Sub

Private Sub Command4_Click()
Command1.Visible = True
Command2.Visible = True
Command3.Visible = True
Command4.Visible = False
Label3.ForeColor = vbBlack
Form_Load
End Sub`);
})();
