/* ===== runnable examples (forms + VB code) ===== */
const L = (n, c, l, t, w, h, o) => Object.assign({ name: n, type: 'Label', caption: c, left: l, top: t, width: w, height: h || 20 }, o || {});
const T = (n, x, l, t, w, h, o) => Object.assign({ name: n, type: 'TextBox', text: x, left: l, top: t, width: w, height: h || 22 }, o || {});
const C = (n, c, l, t, w, h, o) => Object.assign({ name: n, type: 'CommandButton', caption: c, left: l, top: t, width: w, height: h || 26 }, o || {});
const IM = (n, pic, l, t, w, h, o) => Object.assign({ name: n, type: 'Image', picture: pic, left: l, top: t, width: w, height: h }, o || {});
const F = (caption, w, h, controls, o) => Object.assign({ caption, w, h, controls }, o || {});

const EX = {};
const ex = (id, ch, title, desc, form, code) => { EX[id] = { id, ch, title, desc, form, code: code.replace(/^\n/, '') }; };

/* ---------- الفصل 1 ---------- */
ex('e1a', 1, "First program: Hello", "We added a Label and a button. Pressing the button changes the Label's text.",
  F('Form1', 300, 150, [L('Label1', "Press the button", 20, 20, 260, 40, { fontsize: 16, alignment: 2 }), C('Command1', 'Say Hello', 90, 80, 120, 32)]),
  String.raw`
Private Sub Form_Load()
Label1.Caption = "Welcome to VB6"
End Sub

Private Sub Command1_Click()
Label1.Caption = "Hello, World!"
Label1.ForeColor = vbBlue
End Sub`);

/* ---------- الفصل 2 ---------- */
ex('e2a', 2, "Label: colours, show and hide", "Click the four words (they are Labels) and watch Label1.",
  F('Form1', 300, 170, [
    L('Label1', 'Visual Basic', 70, 15, 160, 30, { fontsize: 16, alignment: 2, fontbold: true, borderstyle: 1 }),
    L('Label2', 'Forecolor', 15, 80, 62, 22, { alignment: 2, borderstyle: 1 }), L('Label3', 'Backcolor', 85, 80, 62, 22, { alignment: 2, borderstyle: 1 }),
    L('Label4', 'Show', 155, 80, 62, 22, { alignment: 2, borderstyle: 1 }), L('Label5', 'Hide', 225, 80, 62, 22, { alignment: 2, borderstyle: 1 })]),
  String.raw`
Private Sub Label2_Click()
Label1.ForeColor = vbBlue
End Sub

Private Sub Label3_Click()
Label1.BackColor = vbRed
End Sub

Private Sub Label4_Click()
Label1.Visible = True
End Sub

Private Sub Label5_Click()
Label1.Visible = False
End Sub`);

ex('e2b', 2, "TextBox: the GotFocus event", "Move the cursor between the two boxes (or press Tab) and watch Text3.",
  F('Form1', 300, 150, [T('Text1', 'Show', 20, 20, 120), T('Text2', 'Hide', 160, 20, 120), T('Text3', 'Visual Basic', 90, 80, 120)]),
  String.raw`
Private Sub Text1_GotFocus()
Text3.Visible = True
End Sub

Private Sub Text2_GotFocus()
Text3.Visible = False
End Sub`);

ex('e2c', 2, "A simple calculator", "Type two numbers, then choose the operation. The Exit button also runs when you press Esc (Cancel = True).",
  F('Calculator', 300, 230, [
    L('Label1', 'Value1', 20, 15, 60), L('Label2', 'Value2', 20, 45, 60), L('Label3', 'Result', 20, 75, 60),
    T('Text1', '', 100, 12, 160), T('Text2', '', 100, 42, 160), T('Text3', '', 100, 72, 160, 22, { locked: true, backcolor: 14737632 }),
    C('Command1', '+', 20, 115, 50), C('Command2', '-', 80, 115, 50), C('Command3', '*', 140, 115, 50), C('Command4', '/', 200, 115, 50),
    C('Command5', 'Clear', 40, 160, 100), C('Command6', '&Exit', 160, 160, 100, 26, { cancel: true })]),
  String.raw`
Private Sub Command1_Click()
Text3 = Val(Text1) + Val(Text2)
End Sub

Private Sub Command2_Click()
Text3 = Val(Text1) - Val(Text2)
End Sub

Private Sub Command3_Click()
Text3 = Val(Text1) * Val(Text2)
End Sub

Private Sub Command4_Click()
If Val(Text2) = 0 Then
Text3 = "Cannot divide by 0"
Else
Text3 = Val(Text1) / Val(Text2)
End If
End Sub

Private Sub Command5_Click()
Text1 = ""
Text2 = ""
Text3 = ""
End Sub

Private Sub Command6_Click()
End
End Sub`);

ex('e2d', 2, "Why do we need Val?", "Press both buttons and compare the results. The first adds \"text\"; the second adds \"numbers\".",
  F('Form1', 300, 170, [T('Text1', '12', 30, 15, 100), T('Text2', '30', 170, 15, 100), L('Label1', "Result", 20, 125, 260, 24, { alignment: 2, fontsize: 12, fontbold: true }),
    C('Command1', 'Text1 + Text2', 20, 60, 120), C('Command2', 'Val + Val', 160, 60, 120)]),
  String.raw`
Private Sub Command1_Click()
Label1.Caption = Text1.Text + Text2.Text
End Sub

Private Sub Command2_Click()
Label1.Caption = Val(Text1.Text) + Val(Text2.Text)
End Sub`);

ex('e2e', 2, "The Change event, MaxLength and Locked", "Type in the first box (12 characters maximum). The second box is locked (Locked) and shows the text in capital letters.",
  F('Form1', 300, 170, [T('Text1', '', 20, 20, 260, 22, { maxlength: 12 }), T('Text2', '', 20, 60, 260, 22, { locked: true, backcolor: 14737632 }), L('Label1', 'Characters: 0', 20, 105, 260, 22, { fontsize: 11 })]),
  String.raw`
Private Sub Text1_Change()
Text2.Text = UCase(Text1.Text)
Label1.Caption = "Characters: " & Len(Text1.Text)
End Sub`);

ex('e2f', 2, "Rectangle area (exercise solution)", "Exercise: length × width.",
  F('Rectangle', 300, 190, [L('Label1', 'Length', 20, 18, 70), L('Label2', 'Width', 20, 52, 70), L('Label3', 'Area', 20, 86, 70),
    T('Text1', '', 110, 15, 150), T('Text2', '', 110, 49, 150), T('Text3', '', 110, 83, 150, 22, { locked: true, backcolor: 14737632 }), C('Command1', 'Calculate', 90, 130, 120)]),
  String.raw`
Private Sub Command1_Click()
Text3.Text = Val(Text1.Text) * Val(Text2.Text)
End Sub`);

/* ---------- الفصل 3 ---------- */
ex('e3a', 3, "The Click event (Application 1)", "Click the button, the Label, the text box, and then the form background.",
  F('Form1', 300, 200, [C('Command1', 'Command1', 20, 20, 100, 28), L('Label1', 'Label1', 160, 22, 100, 22, { borderstyle: 1, alignment: 2 }), T('Text1', 'Text1', 20, 80, 100)]),
  String.raw`
Private Sub Command1_Click()
MsgBox "You clicked in to command button"
End Sub

Private Sub Label1_Click()
Label1.Caption = "Click"
End Sub

Private Sub Text1_Click()
Text1.Left = Text1.Left + 300
End Sub

Private Sub Form_Click()
Form1.BackColor = vbRed
End Sub`);

ex('e3b', 3, "The DblClick event (Application 2)", "Type some text in Text1, then double-click the Label.",
  F('Form1', 300, 170, [T('Text1', 'Hello', 20, 20, 120), T('Text2', '', 160, 20, 120), L('Label1', 'Double click me', 70, 80, 160, 26, { borderstyle: 1, alignment: 2, fontsize: 11 })]),
  String.raw`
Private Sub Label1_DblClick()
Text2.Text = Text1.Text
Form1.Caption = "Double Click Event"
End Sub`);

ex('e3c', 3, "The MouseMove event (Application 3)", "Move the mouse over the form to see X and Y. Then pass over the two buttons.",
  F('Form1', 300, 210, [T('Text1', '', 20, 20, 120), T('Text2', '', 160, 20, 120), C('Command1', 'Font size', 20, 150, 110), C('Command2', 'Back color', 160, 150, 110)]),
  String.raw`
Private Sub Form_MouseMove(Button As Integer, Shift As Integer, X As Single, Y As Single)
Text1.Text = X
Text2.Text = Y
Text1.FontSize = 8
Text2.FontSize = 8
Text1.BackColor = vbWhite
Text2.BackColor = vbWhite
End Sub

Private Sub Command1_MouseMove(Button As Integer, Shift As Integer, X As Single, Y As Single)
Text1.FontSize = 16
Text2.FontSize = 16
End Sub

Private Sub Command2_MouseMove(Button As Integer, Shift As Integer, X As Single, Y As Single)
Text1.BackColor = vbYellow
Text2.BackColor = vbYellow
End Sub`);

ex('e3d', 3, "Drag and drop: DragDrop (Application 4)", "Drag the picture and drop it anywhere on the form.",
  F('Form1', 300, 210, [IM('Image1', '🖼️', 30, 30, 54, 54, { dragmode: 1 })]),
  String.raw`
Private Sub Form_DragDrop(Source As Control, X As Single, Y As Single)
Source.Left = X
Source.Top = Y
End Sub`);

ex('e3e', 3, "MouseDown and MouseUp (Experiment 1)", "Press on the Label and hold, then release the button.",
  F('Form1', 300, 150, [L('Label1', 'Press me', 60, 40, 180, 50, { fontsize: 16, alignment: 2, borderstyle: 1, backcolor: 16777215 })]),
  String.raw`
Private Sub Label1_MouseDown(Button As Integer, Shift As Integer, X As Single, Y As Single)
Label1.Caption = "Mouse Down"
Label1.BackColor = vbBlue
End Sub

Private Sub Label1_MouseUp(Button As Integer, Shift As Integer, X As Single, Y As Single)
Label1.Caption = "Mouse Up"
Label1.BackColor = vbRed
End Sub`);

/* ---------- الفصل 4 ---------- */
ex('e4a', 4, "Area and circumference of a circle (Const)", "Enter the radius. The constant PI never changes.",
  F('The Circle', 300, 220, [L('Label1', 'Enter the radius', 20, 18, 130), L('Label2', 'The Area is', 20, 56, 130), L('Label3', 'The Circumference', 20, 94, 130),
    T('Text1', '2', 160, 15, 120), T('Text2', '', 160, 53, 120, 22, { locked: true }), T('Text3', '', 160, 91, 120, 22, { locked: true }), C('Command1', 'Press', 90, 140, 120, 30)]),
  String.raw`
Private Sub Command1_Click()
Const PI As Single = 3.14
Dim R As Single
Dim Z As Single
R = Val(Text1.Text)
Z = PI * R * R
Text2.Text = Z
Text3.Text = 2 * PI * R
End Sub`);

ex('e4b', 4, "Local variables", "Each procedure has its own x. Press the three buttons.",
  F('Form1', 300, 230, [C('Command1', 'Command1', 10, 8, 85), C('Command2', 'Command2', 107, 8, 85), C('Command3', 'Command3', 204, 8, 85)]),
  String.raw`
Private Sub Command1_Click()
Dim x As Integer
x = 1
Print "Command1: x ="; x
End Sub

Private Sub Command2_Click()
Dim x As Integer
x = 7
Print "Command2: x ="; x
End Sub

Private Sub Command3_Click()
Dim x As String
x = "welcome"
Print "Command3: x = "; x
End Sub`);

ex('e4c', 4, "A form-level variable", "The variable n is declared outside the procedures, so every procedure can see it and change it.",
  F('Form1', 300, 230, [C('Command1', 'n = n + 1', 10, 8, 85), C('Command2', 'n = n + 10', 107, 8, 85), C('Command3', 'Reset', 204, 8, 85)]),
  String.raw`
Dim n As Integer

Private Sub Command1_Click()
n = n + 1
Print "n ="; n
End Sub

Private Sub Command2_Click()
n = n + 10
Print "n ="; n
End Sub

Private Sub Command3_Click()
n = 0
Cls
End Sub`);

ex('e4d', 4, "Option Explicit: forcing declaration (intentional error)", "The first button works. The second button shows an error on purpose, because it uses a variable that was not declared. Delete the first line in the lab and try again.",
  F('Form1', 300, 200, [C('Command1', 'Declared (Dim s)', 10, 8, 135), C('Command2', 'Not declared', 155, 8, 135)]),
  String.raw`
Option Explicit

Private Sub Command1_Click()
Dim s As Integer
s = 1
Print s
End Sub

Private Sub Command2_Click()
S2 = 1
Print S2
End Sub`);

ex('e4e', 4, "Homework: what do Command1, Command2 and Command3 produce?", "Note: Dim a, b As Integer makes a a Variant. A Dim inside a procedure hides the module-level variable. Try them in order: 1, then 2, then 3.",
  F('Form1', 300, 260, [C('Command1', 'Command1', 10, 8, 85), C('Command2', 'Command2', 107, 8, 85), C('Command3', 'Command3', 204, 8, 85)]),
  String.raw`
Option Explicit
Dim a, b As Integer
Dim z As Integer

Private Sub Command1_Click()
a = 10
b = 4
z = a + b
Print "a"; a, "b= "; b, "z= "; z
End Sub

Private Sub Command2_Click()
Dim b As Integer
Print "b= "; b
z = a - b
Print "a"; a, "b= "; b, "z= "; z
End Sub

Private Sub Command3_Click()
Print "z="; z
Dim a As Integer
z = z * a
Print "a"; a, "b= "; b, "z= "; z
End Sub`);

ex('e4f', 4, "Variable types: limits and rounding", "Try each button. The first button raises an Overflow error on purpose, to show you the limits of the Integer type.",
  F('Form1', 300, 230, [C('Command1', 'Integer + 10000', 10, 8, 135), C('Command2', 'Long + 10000', 155, 8, 135), C('Command3', 'Integer = 3.7', 10, 44, 135), C('Command4', 'Single = 3.7', 155, 44, 135)]),
  String.raw`
Private Sub Command1_Click()
Dim x As Integer
x = 30000
x = x + 10000
Print x
End Sub

Private Sub Command2_Click()
Dim x As Long
x = 30000
x = x + 10000
Print x
End Sub

Private Sub Command3_Click()
Dim x As Integer
x = 3.7
Print x
End Sub

Private Sub Command4_Click()
Dim x As Single
x = 3.7
Print x
End Sub`);

/* ---------- الفصل 5 ---------- */
ex('e5a', 5, "InputBox: adding and subtracting two numbers", "The numbers are entered through input boxes, and the result is printed on the form.",
  F('Form1', 300, 200, [C('Command1', 'Add', 20, 10, 120), C('Command2', 'Subtract', 160, 10, 120)]),
  String.raw`
Private Sub Command1_Click()
Dim a As Single, b As Single
a = Val(InputBox("Enter first number", "Add"))
b = Val(InputBox("Enter second number", "Add"))
Print "Sum = "; a + b
End Sub

Private Sub Command2_Click()
Dim a As Single, b As Single
a = Val(InputBox("Enter first number", "Subtract"))
b = Val(InputBox("Enter second number", "Subtract"))
Print "Difference = "; a - b
End Sub`);

ex('e5b', 5, "Three input boxes: y = a × b + c", "Each input box is for one variable.",
  F('Form1', 300, 190, [C('Command1', 'Solve y = a*b + c', 60, 10, 180), L('Label1', '', 20, 60, 260, 40, { fontsize: 13, alignment: 2, fontbold: true })]),
  String.raw`
Private Sub Command1_Click()
Dim a As Single, b As Single, c As Single, y As Single
a = Val(InputBox("Enter a", "Equation"))
b = Val(InputBox("Enter b", "Equation"))
c = Val(InputBox("Enter c", "Equation"))
y = a * b + c
Label1.Caption = "y = " & y
End Sub`);

ex('e5c', 5, "Entering a student's name and stage", "InputBox returns text (String), so we put it straight into the text box.",
  F('Form1', 300, 200, [L('Label1', 'Name', 20, 20, 80), L('Label2', 'Level', 20, 55, 80), T('Text1', '', 110, 17, 160), T('Text2', '', 110, 52, 160), C('Command1', 'Enter data', 80, 100, 140, 28), L('Label3', '', 20, 150, 260, 22, { alignment: 2, fontbold: true })]),
  String.raw`
Private Sub Command1_Click()
Text1.Text = InputBox("Enter student name", "Student")
Text2.Text = InputBox("Enter student level", "Student")
Label3.Caption = Text1.Text & " - " & Text2.Text
End Sub`);

ex('e5d', 5, "MsgBox gallery: buttons and icons", "Each button shows a different message box. The number = (buttons value + icon value).",
  F('Form1', 300, 240, [C('Command1', '1', 10, 10, 85), C('Command2', '1 + 32', 107, 10, 85), C('Command3', '4 + 64', 204, 10, 85), C('Command4', '2 + 16', 10, 50, 85), C('Command5', '5 + 48', 107, 50, 85)]),
  String.raw`
Private Sub Command1_Click()
MsgBox "Save Changes?", 1, "Exit"
End Sub

Private Sub Command2_Click()
MsgBox "Save Changes?", 1 + 32, "Exit"
End Sub

Private Sub Command3_Click()
MsgBox "save change", 4 + 64, "Exit"
End Sub

Private Sub Command4_Click()
MsgBox "Error occurred", 2 + 16, "setup"
End Sub

Private Sub Command5_Click()
MsgBox "Error occurred", 5 + 48, "setup"
End Sub`);

ex('e5e', 5, "MsgBox returns a value: confirming exit", "We store what the box returns in a variable, then decide. 6 = Yes and 7 = No.",
  F('Form1', 300, 160, [C('Command1', 'Exit', 90, 15, 120, 30), L('Label1', '', 20, 70, 260, 40, { alignment: 2, fontsize: 12 })]),
  String.raw`
Private Sub Command1_Click()
Dim k As Integer
k = MsgBox("Do you want to exit?", 4 + 32, "Exit")
If k = 6 Then
End
Else
Label1.Caption = "You pressed No (value = " & k & ")"
End If
End Sub`);

ex('e5f', 5, "Three buttons: Start, Clear and Exit", "Start reads the name. Clear and Exit ask for confirmation with MsgBox.",
  F('Form1', 300, 180, [L('Label1', 'Student', 20, 20, 70), T('Text1', '', 100, 17, 180), C('Command1', 'Start', 15, 80, 80), C('Command2', 'Clear', 110, 80, 80), C('Command3', 'Exit', 205, 80, 80)]),
  String.raw`
Private Sub Command1_Click()
Text1.Text = InputBox("Enter student name", "Start")
End Sub

Private Sub Command2_Click()
If MsgBox("Clear the text?", 4 + 32, "Clear") = vbYes Then Text1.Text = ""
End Sub

Private Sub Command3_Click()
If MsgBox("Exit the program?", 1 + 48, "Exit") = vbOK Then End
End Sub`);

ex('e5g', 5, "Conditional GoTo", "If the number is negative we jump to the line ErrMsg; otherwise we compute the square root.",
  F('Form1', 300, 160, [C('Command1', 'Square root', 80, 15, 140, 30), L('Label1', '', 20, 70, 260, 40, { alignment: 2, fontsize: 12 })]),
  String.raw`
Private Sub Command1_Click()
Dim x As Single
x = Val(InputBox("Enter a number (0 or more)", "Square root"))
If x < 0 Then GoTo ErrMsg
Label1.Caption = "Sqr(x) = " & Sqr(x)
Exit Sub
ErrMsg:
Label1.Caption = "Error: negative number!"
End Sub`);

ex('e5h', 5, "Unconditional GoTo (line number)", "GoTo 18 jumps straight ahead, skipping the line that sets 60.",
  F('Form1', 300, 130, [T('Text1', '', 90, 20, 120), C('Command1', 'Run', 90, 65, 120)]),
  String.raw`
Private Sub Command1_Click()
Text1.Text = 50
GoTo 18
Text1.Text = 60
18 End Sub`);

/* ---------- الفصل 6 ---------- */
ex('e6a', 6, "Odd or even?", "If … Else with the Mod operator (remainder of division).",
  F('Form1', 300, 190, [L('Label1', 'Enter the number', 20, 20, 130), L('Label2', 'The type is', 20, 60, 130), T('Text1', '7', 160, 17, 110), T('Text2', '', 160, 57, 110, 22, { locked: true }), C('Command1', 'Determine', 90, 110, 120, 30)]),
  String.raw`
Private Sub Command1_Click()
Dim x As Long
x = Val(Text1.Text)
If (x Mod 2 = 0) Then
Text2.Text = "Even"
Else
Text2.Text = "Odd"
End If
End Sub`);

ex('e6b', 6, "The Lucky Seven game", "Three random numbers. If 7 appears in any of them, you win.",
  F('Lucky Seven', 300, 220, [L('Label1', 'Lucky Seven', 20, 10, 260, 26, { alignment: 2, fontsize: 14, fontbold: true }), L('Label2', 'First Number', 15, 50, 85, 20), L('Label3', 'Second Number', 108, 50, 90, 20), L('Label4', 'Third Number', 205, 50, 85, 20),
    T('Text1', '', 25, 72, 65, 24, { alignment: 2 }), T('Text2', '', 118, 72, 65, 24, { alignment: 2 }), T('Text3', '', 215, 72, 65, 24, { alignment: 2 }), L('Label5', 'Result', 20, 115, 60), T('Text4', '', 90, 112, 110, 24, { alignment: 2 }),
    C('Command1', 'Roll', 40, 165, 90), C('Command2', 'Exit', 170, 165, 90)]),
  String.raw`
Private Sub Command1_Click()
Dim a As Integer, b As Integer, c As Integer
a = Int(Rnd * 10)
b = Int(Rnd * 10)
c = Int(Rnd * 10)
Text1.Text = a
Text2.Text = b
Text3.Text = c
If (a = 7) Or (b = 7) Or (c = 7) Then
Text4.Text = "You Win"
Else
Text4.Text = "You Lose"
End If
End Sub

Private Sub Command2_Click()
End
End Sub`);

ex('e6c', 6, "A multi-condition function (If … ElseIf)", "y = x+1 if x>2, y = x² if 0≤x≤2, and y = x³−5 if x<0.",
  F('Form1', 300, 190, [L('Label1', 'Enter the value of X', 20, 20, 130), L('Label2', 'The value of Y is', 20, 60, 130), T('Text1', '3', 160, 17, 110), T('Text2', '', 160, 57, 110, 22, { locked: true }), C('Command1', 'PRESS', 90, 110, 120, 30)]),
  String.raw`
Private Sub Command1_Click()
Dim a As Single, b As Single
a = Val(Text1.Text)
If (a > 2) Then
b = a + 1
ElseIf (a >= 0) And (a <= 2) Then
b = a ^ 2
ElseIf (a < 0) Then
b = (a ^ 3) - 5
End If
Text2.Text = b
End Sub`);

ex('e6d', 6, "Student grade (Select Case)", "Enter the mark and watch the grade. Note Case 90 To 100 and Case Is < 50.",
  F('Form1', 300, 190, [L('Label1', 'MARK', 20, 20, 120), L('Label2', 'EVALUATION', 20, 60, 120), T('Text1', '85', 160, 17, 110), T('Text2', '', 160, 57, 110, 22, { locked: true }), C('Command1', 'EVALUATE', 80, 110, 140, 30)]),
  String.raw`
Private Sub Command1_Click()
Dim x As Long, y As String
x = Val(Text1.Text)
Select Case x
Case 90 To 100
y = "Excellent"
Case 80 To 89
y = "Very Good"
Case 70 To 79
y = "Good"
Case 60 To 69
y = "Medium"
Case 50 To 59
y = "Fair"
Case Is < 50
y = "Failed"
End Select
Text2.Text = y
End Sub`);

ex('e6e', 6, "Choosing an equation (Select Case)", "Enter x, then the equation number from 1 to 4. Any other number gives Wrong Choice.",
  F('EXAMPLE', 300, 200, [L('Label1', 'Input x', 15, 20, 80), L('Label2', 'Choose 1 to 4', 100, 20, 100), L('Label3', 'Result (y)', 205, 20, 80),
    T('Text1', '2', 15, 45, 80), T('Text2', '1', 105, 45, 80), T('Text3', '', 195, 45, 90), C('Command1', 'Solution', 90, 100, 120, 30)]),
  String.raw`
Private Sub Command1_Click()
Dim x As Single, n As Long
x = Val(Text1.Text)
n = Val(Text2.Text)
Select Case n
Case 1
Text3.Text = (x ^ 3) + (3 * Exp(-5))
Case 2
Text3.Text = Sin(x) + Cos(x ^ 2)
Case 3
Text3.Text = Log(x) + Tan(x)
Case 4
Text3.Text = (Sin(x)) ^ 2 + (x ^ 4)
Case Is > 4
Text3.Text = "Wrong Choice"
End Select
End Sub`);

ex('e6f', 6, "Homework: checking the user name and password", "The correct pair is admin / 1234. Try all four cases.",
  F('Login', 300, 210, [L('Label1', 'Username', 20, 20, 80), L('Label2', 'Password', 20, 56, 80), T('Text1', '', 110, 17, 160), T('Text2', '', 110, 53, 160), C('Command1', 'Check', 90, 100, 120, 30), L('Label3', '', 20, 150, 260, 26, { alignment: 2, fontsize: 12, fontbold: true })]),
  String.raw`
Private Sub Command1_Click()
Dim u As String, p As String
u = Text1.Text
p = Text2.Text
If u = "admin" And p = "1234" Then
Label3.Caption = "Welcome"
ElseIf u <> "admin" And p <> "1234" Then
Label3.Caption = "Wrong Information"
ElseIf u <> "admin" Then
Label3.Caption = "Wrong user"
Else
Label3.Caption = "Wrong password"
End If
End Sub`);

ex('e6g', 6, "Homework: the largest and smallest of three numbers", "We assume the first number is both the largest and the smallest, then compare it with the others.",
  F('Form1', 300, 230, [L('Label1', 'a', 20, 20, 20), L('Label2', 'b', 110, 20, 20), L('Label3', 'c', 200, 20, 20), T('Text1', '4', 20, 42, 70), T('Text2', '9', 110, 42, 70), T('Text3', '6', 200, 42, 70),
    C('Command1', 'Find Max and Min', 70, 90, 160, 30), L('Label4', '', 20, 140, 260, 50, { alignment: 2, fontsize: 12, fontbold: true })]),
  String.raw`
Private Sub Command1_Click()
Dim a As Single, b As Single, c As Single
Dim mx As Single, mn As Single
a = Val(Text1.Text)
b = Val(Text2.Text)
c = Val(Text3.Text)
mx = a
mn = a
If b > mx Then mx = b
If c > mx Then mx = c
If b < mn Then mn = b
If c < mn Then mn = c
Label4.Caption = "Max = " & mx & "   Min = " & mn
End Sub`);

ex('e6h', 6, "Homework: divisible by 4 or 5", "We use Mod. If the remainder is zero, the number is divisible.",
  F('Form1', 300, 190, [L('Label1', 'Enter a number', 20, 20, 120), T('Text1', '20', 160, 17, 110), C('Command1', 'Check', 90, 65, 120, 30), L('Label2', '', 20, 115, 260, 40, { alignment: 2, fontsize: 12, fontbold: true })]),
  String.raw`
Private Sub Command1_Click()
Dim x As Long
x = Val(Text1.Text)
If x Mod 4 = 0 And x Mod 5 = 0 Then
Label2.Caption = "Divisible by 4 and 5"
ElseIf x Mod 4 = 0 Then
Label2.Caption = "Divisible by 4"
ElseIf x Mod 5 = 0 Then
Label2.Caption = "Divisible by 5"
Else
Label2.Caption = "Not divisible by 4 or 5"
End If
End Sub`);

ex('e6i', 6, "Homework: a three-branch function (Select Case)", "y = (x³+5)/(x²−2) for x = 1..4, y = 7x⁻² for 5≤x≤10, and y = 60−x for x>11. What about x = 11?",
  F('Form1', 300, 190, [L('Label1', 'x', 20, 20, 120), L('Label2', 'y', 20, 60, 120), T('Text1', '2', 160, 17, 110), T('Text2', '', 160, 57, 110, 22, { locked: true }), C('Command1', 'Solve', 90, 110, 120, 30)]),
  String.raw`
Private Sub Command1_Click()
Dim x As Single, y As Single
x = Val(Text1.Text)
Select Case x
Case 1, 2, 3, 4
y = (x ^ 3 + 5) / (x ^ 2 - 2)
Text2.Text = y
Case 5 To 10
y = 7 * x ^ -2
Text2.Text = y
Case Is > 11
y = 60 - x
Text2.Text = y
Case Else
Text2.Text = "Undefined"
End Select
End Sub`);

ex('lab0', 0, "Empty lab", "A ready form with three text boxes, three buttons and three Labels. Write your code and try it.",
  F('Form1', 300, 260, [L('Label1', 'Label1', 20, 15, 80), L('Label2', 'Label2', 110, 15, 80), L('Label3', 'Label3', 200, 15, 80),
    T('Text1', '', 20, 42, 80), T('Text2', '', 110, 42, 80), T('Text3', '', 200, 42, 80), C('Command1', 'Command1', 10, 90, 85), C('Command2', 'Command2', 107, 90, 85), C('Command3', 'Command3', 204, 90, 85)]),
  String.raw`
Private Sub Command1_Click()
Text3.Text = Val(Text1.Text) + Val(Text2.Text)
End Sub

Private Sub Command2_Click()
Print "Hello from VB"
End Sub

Private Sub Command3_Click()
Cls
End Sub`);


/* ---------- تطبيق عملي على كل أداة ---------- */
ex('t_label', 2, "Label application: all properties", "Press the buttons and watch how the properties of the large Label1 change.",
  F('Form1', 340, 230, [L('Label1', 'Hello', 20, 15, 300, 60, { borderstyle: 1, fontsize: 12 }),
    C('Command1', 'Caption', 8, 100, 75), C('Command2', 'ForeColor', 90, 100, 75), C('Command3', 'BackColor', 172, 100, 75), C('Command4', 'FontSize', 254, 100, 75),
    C('Command5', 'FontBold', 8, 140, 75), C('Command6', 'BorderStyle', 90, 140, 75), C('Command7', 'Alignment', 172, 140, 75), C('Command8', 'Reset', 254, 140, 75)]),
  String.raw`
Private Sub Command1_Click()
Label1.Caption = "Visual Basic 6"
End Sub

Private Sub Command2_Click()
Label1.ForeColor = vbBlue
End Sub

Private Sub Command3_Click()
Label1.BackColor = vbYellow
End Sub

Private Sub Command4_Click()
Label1.FontSize = 24
End Sub

Private Sub Command5_Click()
Label1.FontBold = True
End Sub

Private Sub Command6_Click()
Label1.BorderStyle = 0
End Sub

Private Sub Command7_Click()
Label1.Alignment = 2
End Sub

Private Sub Command8_Click()
Label1.Caption = "Hello"
Label1.ForeColor = vbBlack
Label1.BackColor = 13160660
Label1.FontSize = 12
Label1.FontBold = False
Label1.BorderStyle = 1
Label1.Alignment = 0
End Sub`);

ex('t_text', 2, "TextBox application: properties and methods", "Type in both boxes, then try the buttons. Note MaxLength, MultiLine, Locked, Enabled and SetFocus.",
  F('Form1', 340, 280, [L('Label1', 'Name', 15, 15, 70), T('Text1', '', 90, 12, 230, 22, { maxlength: 10 }), L('Label2', 'Notes', 15, 50, 70), T('Text2', '', 90, 47, 230, 56, { multiline: true }),
    L('Label3', '', 15, 112, 305, 22, { borderstyle: 1 }),
    C('Command1', 'Copy to Label', 8, 145, 100), C('Command2', 'SetFocus Text2', 116, 145, 100), C('Command3', 'Locked on/off', 224, 145, 100),
    C('Command4', 'Clear', 8, 185, 100), C('Command5', 'Disable', 116, 185, 100), C('Command6', 'Enable', 224, 185, 100)]),
  String.raw`
Private Sub Command1_Click()
Label3.Caption = Text1.Text
End Sub

Private Sub Command2_Click()
Text2.SetFocus
End Sub

Private Sub Command3_Click()
Text1.Locked = Not Text1.Locked
End Sub

Private Sub Command4_Click()
Text1.Text = ""
Text2.Text = ""
Text1.SetFocus
End Sub

Private Sub Command5_Click()
Text1.Enabled = False
End Sub

Private Sub Command6_Click()
Text1.Enabled = True
End Sub`);

ex('t_btn', 2, "CommandButton application: properties and events", "The Target button is the target; the other buttons control it. The last button is the Default button, so the Enter key also runs it.",
  F('Form1', 340, 260, [C('Command3', 'Target', 110, 12, 120, 30), L('Label1', 'Waiting...', 20, 55, 300, 22, { borderstyle: 1, alignment: 2 }),
    C('Command1', 'Disable Target', 8, 95, 100), C('Command2', 'Enable Target', 116, 95, 100), C('Command4', 'Rename', 224, 95, 100),
    C('Command5', 'Hide/Show', 8, 135, 100), C('Command6', 'Move right', 116, 135, 100), C('Command7', 'OK (Default)', 224, 135, 100, 26, { default: true })]),
  String.raw`
Private Sub Command3_Click()
Label1.Caption = "Target was clicked"
End Sub

Private Sub Command1_Click()
Command3.Enabled = False
End Sub

Private Sub Command2_Click()
Command3.Enabled = True
End Sub

Private Sub Command4_Click()
Command3.Caption = "Renamed"
End Sub

Private Sub Command5_Click()
Command3.Visible = Not Command3.Visible
End Sub

Private Sub Command6_Click()
Command3.Left = Command3.Left + 300
End Sub

Private Sub Command7_Click()
Label1.Caption = "Default button (Enter key)"
End Sub`);

ex('t_img', 2, "Image application: the picture", "The Image control shows a picture. Here we use symbols instead of image files. Try the buttons, and click the picture itself.",
  F('Form1', 340, 260, [IM('Image1', '🐱', 140, 15, 60, 60), L('Label1', 'Click the image', 20, 90, 300, 22, { borderstyle: 1, alignment: 2 }),
    C('Command1', 'Dog', 8, 130, 75), C('Command2', 'Cat', 90, 130, 75), C('Command3', 'Hide/Show', 172, 130, 75), C('Command4', 'Bigger', 254, 130, 75),
    C('Command5', 'Move right', 8, 170, 100), C('Command6', 'Reset', 116, 170, 100)]),
  String.raw`
Private Sub Command1_Click()
Image1.Picture = LoadPicture("dog")
End Sub

Private Sub Command2_Click()
Image1.Picture = LoadPicture("cat")
End Sub

Private Sub Command3_Click()
Image1.Visible = Not Image1.Visible
End Sub

Private Sub Command4_Click()
Image1.Width = Image1.Width + 600
Image1.Height = Image1.Height + 600
End Sub

Private Sub Command5_Click()
Image1.Left = Image1.Left + 300
End Sub

Private Sub Command6_Click()
Image1.Left = 2100
Image1.Width = 900
Image1.Height = 900
Image1.Visible = True
End Sub

Private Sub Image1_Click()
Label1.Caption = "You clicked the image"
End Sub`);

ex('t_form', 2, "Form application: the form itself", "The form is also an object with properties and events. Change its colour and title, and click its background.",
  F('Form1', 340, 250, [L('Label1', 'Title', 15, 15, 60), T('Text1', 'My Form', 80, 12, 160), C('Command1', 'Set Caption', 250, 10, 80),
    C('Command2', 'Red', 8, 60, 75), C('Command3', 'Green', 90, 60, 75), C('Command4', 'Blue', 172, 60, 75), C('Command5', 'Print', 254, 60, 75)]),
  String.raw`
Private Sub Form_Load()
Form1.Caption = "Form Demo"
End Sub

Private Sub Command1_Click()
Form1.Caption = Text1.Text
End Sub

Private Sub Command2_Click()
Form1.BackColor = vbRed
End Sub

Private Sub Command3_Click()
Form1.BackColor = vbGreen
End Sub

Private Sub Command4_Click()
Form1.BackColor = vbBlue
End Sub

Private Sub Command5_Click()
Print "Hello from the form"
End Sub

Private Sub Form_Click()
Form1.Caption = "You clicked the form"
End Sub`);

ex('all1', 6, "Complete project: student results system", "One program that combines every control: Form, Label, TextBox, CommandButton and Image, with InputBox, MsgBox, variables, If and Select Case.",
  F('Student Result System', 360, 350, [
    L('Label1', 'Student Result System', 10, 8, 340, 26, { fontsize: 12, fontbold: true, alignment: 2 }),
    L('Label2', 'Name', 20, 42, 80), T('Text1', '', 110, 39, 230),
    L('Label3', 'Math', 20, 72, 100), L('Label4', 'English', 130, 72, 100), L('Label5', 'Computer', 240, 72, 100),
    T('Text2', '', 20, 92, 90), T('Text3', '', 130, 92, 90), T('Text4', '', 240, 92, 90),
    C('Command1', 'Calculate', 20, 130, 100, 28), C('Command2', 'Clear', 130, 130, 100, 28), C('Command3', 'Exit', 240, 130, 100, 28, { cancel: true }),
    L('Label6', 'Average', 20, 178, 80), T('Text5', '', 110, 175, 100, 22, { locked: true, backcolor: 14737632 }),
    L('Label7', 'Grade', 20, 210, 80), T('Text6', '', 110, 207, 100, 22, { locked: true, backcolor: 14737632 }),
    IM('Image1', '🎓', 250, 168, 70, 70),
    C('Command4', 'Pass mark', 20, 247, 100, 26), L('Label8', '', 130, 250, 210, 20),
    L('Label9', '', 20, 288, 320, 24, { borderstyle: 1 })]),
  String.raw`
Option Explicit
Dim passMark As Long
Dim count As Long

Private Sub Form_Load()
passMark = 50
Label8.Caption = "Pass mark = " & passMark
Label9.Caption = "Type the student name"
End Sub

Private Sub Text1_GotFocus()
Label9.Caption = "Type the student name"
End Sub

Private Sub Text2_GotFocus()
Label9.Caption = "Enter the Math mark (0 - 100)"
End Sub

Private Sub Text3_GotFocus()
Label9.Caption = "Enter the English mark (0 - 100)"
End Sub

Private Sub Text4_GotFocus()
Label9.Caption = "Enter the Computer mark (0 - 100)"
End Sub

Private Sub Command1_Click()
Dim m As Single, e As Single, c As Single, avg As Single
If Text1.Text = "" Then
MsgBox "Please enter the student name", 48, "Missing name"
Text1.SetFocus
Exit Sub
End If
m = Val(Text2.Text)
e = Val(Text3.Text)
c = Val(Text4.Text)
If m < 0 Or m > 100 Or e < 0 Or e > 100 Or c < 0 Or c > 100 Then
MsgBox "Marks must be between 0 and 100", 16, "Error"
Exit Sub
End If
avg = (m + e + c) / 3
Text5.Text = Format(avg, "0.0")
Select Case avg
Case Is >= 90
Text6.Text = "Excellent"
Case Is >= 80
Text6.Text = "Very Good"
Case Is >= 70
Text6.Text = "Good"
Case Is >= 60
Text6.Text = "Medium"
Case Is >= 50
Text6.Text = "Fair"
Case Else
Text6.Text = "Failed"
End Select
If avg >= passMark Then
Image1.Picture = LoadPicture("happy")
Label9.Caption = Text1.Text & " passed"
Else
Image1.Picture = LoadPicture("sad")
Label9.Caption = Text1.Text & " failed"
End If
count = count + 1
Label1.Caption = "Student Result System (" & count & ")"
End Sub

Private Sub Command2_Click()
Text1.Text = ""
Text2.Text = ""
Text3.Text = ""
Text4.Text = ""
Text5.Text = ""
Text6.Text = ""
Image1.Picture = LoadPicture("card")
Text1.SetFocus
End Sub

Private Sub Command3_Click()
If MsgBox("Exit the program?", 4 + 32, "Exit") = vbYes Then End
End Sub

Private Sub Command4_Click()
passMark = Val(InputBox("Enter the pass mark (1 - 100)", "Pass mark", passMark))
Label8.Caption = "Pass mark = " & passMark
End Sub

Private Sub Image1_Click()
MsgBox "Students calculated: " & count, 64, "Info"
End Sub`);


/* ---------- مثال لكل أمر من أوامر المختبر السريعة ---------- */
ex('cmd_dim', 'cmd', "Dim example: declaring variables", "We declare variables of different types, then use them in one sentence.",
  F('Dim Example', 320, 220, [L('Label1', 'Name', 15, 18, 80), T('Text1', 'Ali', 100, 15, 190), L('Label2', 'Age', 15, 52, 80), T('Text2', '20', 100, 49, 190),
    C('Command1', 'Show', 100, 90, 110, 28), L('Label3', '', 15, 135, 290, 50, { borderstyle: 1, fontsize: 10 })]),
  String.raw`
Private Sub Command1_Click()
Dim n As String
Dim age As Long
Dim nextYear As Long
n = Text1.Text
age = Val(Text2.Text)
nextYear = age + 1
Label3.Caption = n & " is " & age & " now, and " & nextYear & " next year"
End Sub`);

ex('cmd_msgbox', 'cmd', "MsgBox example: kinds of alert messages", "Each button shows a different kind of message. The last button asks a question and acts on your answer.",
  F('MsgBox Example', 320, 220, [C('Command1', 'Info', 15, 15, 85), C('Command2', 'Warning', 118, 15, 85), C('Command3', 'Error', 221, 15, 85),
    C('Command4', 'Delete file?', 90, 60, 140, 28), L('Label1', '', 15, 110, 290, 30, { alignment: 2, fontsize: 11, fontbold: true })]),
  String.raw`
Private Sub Command1_Click()
MsgBox "Saved successfully", 64, "Info"
End Sub

Private Sub Command2_Click()
MsgBox "Battery is low", 48, "Warning"
End Sub

Private Sub Command3_Click()
MsgBox "File not found", 16, "Error"
End Sub

Private Sub Command4_Click()
If MsgBox("Delete the file?", 4 + 32, "Delete") = vbYes Then
Label1.Caption = "File deleted"
Else
Label1.Caption = "Cancelled"
End If
End Sub`);

ex('cmd_inputbox', 'cmd', "InputBox example: getting data from the user", "The first button asks for your name. The second asks for two numbers and adds them.",
  F('InputBox Example', 320, 200, [C('Command1', 'Ask my name', 15, 15, 140, 28), C('Command2', 'Add two numbers', 165, 15, 140, 28),
    L('Label1', '', 15, 70, 290, 26, { borderstyle: 1, alignment: 2, fontsize: 11 }), L('Label2', '', 15, 108, 290, 26, { borderstyle: 1, alignment: 2, fontsize: 11 })]),
  String.raw`
Private Sub Command1_Click()
Dim n As String
n = InputBox("What is your name?", "Name", "Guest")
If n = "" Then
Label1.Caption = "No name entered"
Else
Label1.Caption = "Hello " & n
End If
End Sub

Private Sub Command2_Click()
Dim a As Single, b As Single
a = Val(InputBox("First number", "Add"))
b = Val(InputBox("Second number", "Add"))
Label2.Caption = a & " + " & b & " = " & (a + b)
End Sub`);

ex('cmd_select', 'cmd', "Select Case example: days of the week", "Type a number from 1 to 7 to see the day's name (1 = Saturday). Any other number shows a warning.",
  F('Select Example', 320, 190, [L('Label1', 'Day number', 15, 18, 90), T('Text1', '3', 115, 15, 80), C('Command1', 'Show day', 205, 13, 100, 26),
    L('Label2', '', 15, 70, 290, 36, { borderstyle: 1, alignment: 2, fontsize: 14, fontbold: true })]),
  String.raw`
Private Sub Command1_Click()
Dim d As Long
d = Val(Text1.Text)
Select Case d
Case 1
Label2.Caption = "Saturday"
Case 2
Label2.Caption = "Sunday"
Case 3
Label2.Caption = "Monday"
Case 4
Label2.Caption = "Tuesday"
Case 5
Label2.Caption = "Wednesday"
Case 6
Label2.Caption = "Thursday"
Case 7
Label2.Caption = "Friday"
Case Else
Label2.Caption = "Enter a number from 1 to 7"
End Select
End Sub`);

ex('cmd_if', 'cmd', "If example: checking age", "Type an age and the program decides the group: child, teenager or adult.",
  F('If Example', 320, 190, [L('Label1', 'Age', 15, 18, 80), T('Text1', '25', 100, 15, 100), C('Command1', 'Check', 210, 13, 90, 26),
    L('Label2', '', 15, 70, 290, 36, { borderstyle: 1, alignment: 2, fontsize: 14, fontbold: true })]),
  String.raw`
Private Sub Command1_Click()
Dim age As Long
age = Val(Text1.Text)
If age < 0 Then
Label2.Caption = "Invalid age"
ElseIf age < 13 Then
Label2.Caption = "Child"
ElseIf age < 18 Then
Label2.Caption = "Teenager"
Else
Label2.Caption = "Adult"
End If
End Sub`);

ex('cmd_click', 'cmd', "Click example: a click counter", "Each click on the button increases the counter. Every control has its own Click event.",
  F('Click Example', 320, 200, [C('Command1', 'Click me', 15, 15, 130, 32), C('Command2', 'Reset', 160, 15, 130, 32),
    L('Label1', 'Clicks: 0', 15, 70, 290, 36, { borderstyle: 1, alignment: 2, fontsize: 14, fontbold: true }), L('Label2', 'Click this label too', 15, 120, 290, 24, { alignment: 2 })]),
  String.raw`
Dim clicks As Integer

Private Sub Command1_Click()
clicks = clicks + 1
Label1.Caption = "Clicks: " & clicks
End Sub

Private Sub Command2_Click()
clicks = 0
Label1.Caption = "Clicks: 0"
Label1.ForeColor = vbBlack
End Sub

Private Sub Label2_Click()
Label1.ForeColor = vbRed
End Sub`);

['e4b', 'e4c', 'e4d', 'e4e', 'e5a'].forEach(i => { EX[i].form.printTop = 48; });
EX.e4f.form.printTop = 88;
EX.lab0.form.printTop = 130;
EX.t_form.form.printTop = 110;
if (typeof module !== 'undefined') module.exports = { EX };
