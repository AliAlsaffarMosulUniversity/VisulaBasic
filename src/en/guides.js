/* ===== شرح كل مثال: ماذا يفعل، المدخلات، الأزرار، النتيجة ===== */
const GUIDE = {
lab0: {
  what: "A ready form for experiments: three {{Label}} controls, three text boxes and three buttons. The {{Label}} controls are just captions with no code.",
  ins: [['Text1', "Type the first number here. Example: 1"], ['Text2', "Type the second number here. Example: 2"], ['Text3', "Do not type here. The sum appears here."]],
  btns: [['Command1', "Adds the number in Text1 to the number in Text2 and puts the result in Text3. Example: 1 + 2 gives 3."], ['Command2', "Prints the phrase Hello from VB on the form."], ['Command3', "Clears everything printed on the form (the Cls statement)."]],
  res: "Type 1 and 2, then press Command1: 3 appears in Text3. Press Command2 and the phrase appears on the form. Press Command3 and it disappears.",
  tryit: "Change the code in the editor so that Command1 multiplies the two numbers instead of adding them."
},
e1a: {
  what: "The first program in VB. It has a Label and one button.",
  ins: [],
  btns: [['Form_Load', "Runs automatically when the program opens and writes Welcome to VB6 in Label1."], ['Command1', "When pressed, the text changes to Hello, World! and turns blue."]],
  res: "Before pressing: Welcome to VB6. After pressing: Hello, World! in blue."
},
e2a: {
  what: "Four words, all Labels, that control how the large Label1 looks.",
  ins: [],
  btns: [['Label2 (Forecolor)', "Click it to make Label1's text blue."], ['Label3 (Backcolor)', "Click it to make Label1's background red."], ['Label4 (Show)', "Shows Label1 if it is hidden."], ['Label5 (Hide)', "Hides Label1."]],
  res: "Try them in order: Hide, Show, Forecolor, then Backcolor, and watch Label1."
},
e2b: {
  what: "Shows the {{GotFocus}} event: the moment the cursor enters a text box. There are no buttons.",
  ins: [['Text1', "Click inside it, or move to it with the Tab key."], ['Text2', "Click inside it, or move to it with the Tab key."]],
  btns: [['Text1_GotFocus', "When the cursor enters Text1, Text3 appears."], ['Text2_GotFocus', "When the cursor enters Text2, Text3 disappears."]],
  res: "Click in Text2 and Text3 disappears. Click in Text1 and it appears again."
},
e2c: {
  what: "A calculator that performs an operation on two numbers.",
  ins: [['Text1 (Value1)', "The first number. Example: 12"], ['Text2 (Value2)', "The second number. Example: 5"], ['Text3 (Result)', "Locked. It only shows the result."]],
  btns: [['Command1 (+)', "Adds. The result is 17."], ['Command2 (-)', "Subtracts. The result is 7."], ['Command3 (*)', "Multiplies. The result is 60."], ['Command4 (/)', "Divides. The result is 2.4. If the divisor is zero, the message Cannot divide by 0 appears."], ['Command5 (Clear)', "Clears the three boxes."], ['Command6 (Exit)', "Ends the program. The Esc key also runs it."]],
  res: "Type 12 and 5, then try the four buttons. Try dividing by 0 to see how the program avoids the error.",
  tryit: "The {{Val}} function converts the text in the box into a number."
},
e2d: {
  what: "Shows the difference between adding text and adding numbers.",
  ins: [['Text1', "The first number. Default value: 12"], ['Text2', "The second number. Default value: 30"]],
  btns: [['Command1', "Adds without {{Val}}. It joins the two texts, so 1230 appears."], ['Command2', "Adds with {{Val}}. It treats them as numbers, so 42 appears."]],
  res: "The result appears in Label1 at the bottom of the form. The same two numbers give two different results."
},
e2e: {
  what: "Shows the {{Change}} event and the {{MaxLength}} and {{Locked}} properties.",
  ins: [['Text1', "Type any text. It accepts no more than 12 characters (MaxLength = 12)."], ['Text2', "Locked. Do not type in it. It shows the same text in capital letters."]],
  btns: [['Text1_Change', "Runs with every character you type. It copies the text to Text2 in capitals and shows the number of characters in Label1."]],
  res: "Type hello: Text2 shows HELLO and Label1 shows Characters: 5."
},
e2f: {
  what: "Computes the area of a rectangle.",
  ins: [['Text1 (Length)', "Length. Example: 6"], ['Text2 (Width)', "Width. Example: 4"], ['Text3 (Area)', "Locked. The area appears here."]],
  btns: [['Command1 (Calculate)', "Multiplies the length by the width and puts the result in Text3."]],
  res: "6 and 4 give 24."
},
e3a: {
  what: "Shows the {{Click}} event on four different elements.",
  ins: [],
  btns: [['Command1', "Press it and a message box appears: You clicked in to command button."], ['Label1', "Click it and its text changes to Click."], ['Text1', "Click it and it moves 300 units to the right."], ["Form (the background)", "Click any empty spot and the form background turns red."]],
  res: "Click each element in turn and watch what happens."
},
e3b: {
  what: "Shows the {{DblClick}} event, that is, a double click.",
  ins: [['Text1', "Type any text. Default value: Hello"], ['Text2', "Stays empty. The text will be copied here."]],
  btns: [['Label1 (Double click me)', "Double-click it quickly. It copies the text of Text1 into Text2 and changes the window title to Double Click Event."]],
  res: "A single click does nothing. Only the double click works."
},
e3c: {
  what: "Shows the {{MouseMove}} event, that is, mouse movement.",
  ins: [['Text1', "Do not type in it. It shows the horizontal mouse position X."], ['Text2', "Do not type in it. It shows the vertical mouse position Y."]],
  btns: [['Form_MouseMove', "Move the mouse over the form and the numbers change. It also returns the two boxes to the small font and white background."], ['Command1 (Font size)', "Pass the mouse over it (without clicking) and the two boxes' font gets bigger."], ['Command2 (Back color)', "Pass the mouse over it and the two boxes' background turns yellow."]],
  res: "No clicking is needed. Moving the mouse is enough."
},
e3d: {
  what: "Dragging the picture and dropping it somewhere else.",
  ins: [],
  btns: [['Image1', "Press on it and drag it (DragMode = 1)."], ['Form_DragDrop', "When you drop it, the picture moves to the point where you released it."]],
  res: "Drag the picture to any corner of the form."
},
e3e: {
  what: "Shows the {{MouseDown}} and {{MouseUp}} events.",
  ins: [],
  btns: [['Label1_MouseDown', "When the mouse button is pressed (before release), the text becomes Mouse Down and the background turns blue."], ['Label1_MouseUp', "When the mouse button is released, the text becomes Mouse Up and the background turns red."]],
  res: "Press and hold to see blue, then release to see red."
},
e4a: {
  what: "Computes the area and circumference of a circle. The constant {{PI}} = 3.14 never changes.",
  ins: [['Text1', "The radius. Default value: 2"], ['Text2', "Locked. The area appears here."], ['Text3', "Locked. The circumference appears here."]],
  btns: [['Command1 (Press)', "Computes area = 3.14 × r × r and circumference = 2 × 3.14 × r."]],
  res: "A radius of 2 gives an area of 12.56 and a circumference of 12.56. Try 5: area 78.5 and circumference 31.4."
},
e4b: {
  what: "Shows a {{Local}} variable. Each button has its own variable x, unaffected by the others.",
  ins: [],
  btns: [['Command1', "Declares x as a number with the value 1 and prints Command1: x = 1."], ['Command2', "Declares x as a number with the value 7 and prints Command2: x = 7."], ['Command3', "Declares x as text with the value welcome and prints Command3: x = welcome."]],
  res: "The lines are printed on the form under the buttons. Each press adds a line."
},
e4c: {
  what: "Shows a {{Form-level}} variable. The variable n is declared outside the procedures, so every button can see it and it keeps its value.",
  ins: [],
  btns: [['Command1', "Increases n by 1 and prints it."], ['Command2', "Increases n by 10 and prints it."], ['Command3', "Sets n = 0 and clears the screen."]],
  res: "Press Command1 three times: 1, 2, 3. Press Command2: 13. Press Command3 and everything goes back to zero."
},
e4d: {
  what: "Shows {{Option Explicit}}, which forces you to declare every variable before you use it.",
  ins: [],
  btns: [['Command1 (Declared)', "The variable s is declared with Dim, so it works and prints 1."], ['Command2 (Not declared)', "Intentional error: it uses S2 without declaring it, so Variable not defined appears. This is what we want to show."]],
  res: "Press both buttons and compare. Then open the lab, delete the Option Explicit line, and try the second button again: it will work."
},
e4e: {
  what: "Homework: predict what each button prints, then check. It shows the effect of local and module-level variables.",
  ins: [],
  btns: [['Command1', "Sets a = 10 and b = 4, so z = 14. Prints: a 10 b= 4 z= 14."], ['Command2', "Declares b locally, so its value is 0. So z = 10 − 0 = 10. Prints: a 10 b= 0 z= 10."], ['Command3', "Declares a locally, so its value is 0. So z = 10 × 0 = 0. Prints: a 0 b= 4 z= 0."]],
  res: "Press them in order: Command1, Command2, then Command3.",
  tryit: "If you press Command2 before Command1, a will be zero."
},
e4f: {
  what: "Shows the limits of variable types.",
  ins: [],
  btns: [['Command1 (Integer + 10000)', "Intentional error: x is an Integer (largest value 32767). 30000 + 10000 exceeds the limit, so Overflow appears. This is what we want to show."], ['Command2 (Long + 10000)', "The Long type can hold it, so it prints 40000."], ['Command3 (Integer = 3.7)', "An Integer holds no fraction. It rounds the value and prints 4."], ['Command4 (Single = 3.7)', "A Single holds fractions, so it prints 3.7."]],
  res: "Try the four buttons and compare."
},
e5a: {
  what: "Adds or subtracts two numbers that you enter through input boxes.",
  ins: [["First input box", "Appears after you press the button. Type the first number. Example: 7"], ["Second input box", "Type the second number. Example: 5"]],
  btns: [['Command1 (Add)', "Asks for two numbers, then prints Sum = 12."], ['Command2 (Subtract)', "Asks for two numbers, then prints Difference = 2."]],
  res: "The result is printed on the form."
},
e5b: {
  what: "Solves the equation y = a × b + c. It asks for three numbers.",
  ins: [["First box (a)", "Example: 2"], ["Second box (b)", "Example: 3"], ["Third box (c)", "Example: 4"]],
  btns: [['Command1', "Shows the three boxes one after another, then computes y."]],
  res: "2, 3 and 4 give y = 10. It appears in Label1."
},
e5c: {
  what: "Takes the student's name and stage through {{InputBox}}.",
  ins: [["First box", "Type the name. Example: Ahmed"], ["Second box", "Type the stage. Example: Third"]],
  btns: [['Command1 (Enter data)', "Puts the name in Text1 and the stage in Text2, and combines them in Label3 as: Ahmed - Third."]],
  res: "The data appear in the two text boxes and in Label3."
},
e5d: {
  what: "A gallery of {{MsgBox}} styles. The number on each button is the style number.",
  ins: [],
  btns: [['Command1 (1)', "OK and Cancel buttons with no icon."], ['Command2 (1 + 32)', "OK and Cancel buttons with a question mark."], ['Command3 (4 + 64)', "Yes and No buttons with an information icon."], ['Command4 (2 + 16)', "Abort, Retry and Ignore buttons with an error icon."], ['Command5 (5 + 48)', "Retry and Cancel buttons with an exclamation mark."]],
  res: "The first number sets the buttons (0 to 5). The second sets the icon: 16 error, 32 question, 48 exclamation, 64 information."
},
e5e: {
  what: "Asks \"Do you want to exit?\" and acts on your answer. It stores the user's answer in the variable k.",
  ins: [],
  btns: [['Command1 (Exit)', "Shows a box with Yes and No. If you choose Yes (value 6), the program ends. If you choose No (value 7), Label1 shows You pressed No (value = 7)."]],
  res: "Press Exit, then choose No to see the number 7."
},
e5f: {
  what: "Three buttons: Start, Clear and Exit. Some of them ask for your confirmation first.",
  ins: [['Text1 (Student)', "Filled automatically after you press Start."]],
  btns: [['Command1 (Start)', "Asks for the name through InputBox and puts it in Text1."], ['Command2 (Clear)', "Asks: Clear the text? If you choose Yes, it clears Text1."], ['Command3 (Exit)', "Asks: Exit the program? If you choose OK, the program ends."]],
  res: "Press Start and type a name. Then press Clear and choose Yes: the name disappears."
},
e5g: {
  what: "Computes the square root and blocks negative numbers with the {{GoTo}} statement.",
  ins: [["Input box", "Appears after you press the button. Type a number. Example: 16 or -4"]],
  btns: [['Command1 (Square root)', "If the number is less than zero it jumps to ErrMsg. Otherwise it computes the root."]],
  res: "16 gives Sqr(x) = 4. But -4 gives Error: negative number!"
},
e5h: {
  what: "Shows a {{GoTo}} jump to a line number.",
  ins: [['Text1', "Do not type in it. It shows the result."]],
  btns: [['Command1 (Run)', "Puts 50 in Text1, then GoTo 18 jumps to line 18, skipping the line that sets 60."]],
  res: "50 appears, not 60."
},
e6a: {
  what: "Decides whether a number is odd or even using {{Mod}} (remainder of division).",
  ins: [['Text1', "Enter a whole number. Default value: 7"], ['Text2', "Locked. The type appears here."]],
  btns: [['Command1 (Determine)', "If the remainder of division by 2 is zero, the number is Even; otherwise it is Odd."]],
  res: "7 gives Odd. 10 gives Even."
},
e6b: {
  what: "A game of luck: three random numbers from 0 to 9.",
  ins: [["Text1, Text2 and Text3", "Do not type in them. The random numbers appear here."], ['Text4 (Result)', "The result appears here."]],
  btns: [['Command1 (Roll)', "Rolls three numbers. If one of them is 7 it shows You Win; otherwise You Lose."], ['Command2 (Exit)', "Ends the program."]],
  res: "Press Roll several times. To win you need at least one 7."
},
e6c: {
  what: "Computes y from x using three conditions.",
  ins: [['Text1 (X)', "Enter a number. Default value: 3"], ['Text2 (Y)', "Locked. The result appears here."]],
  btns: [['Command1 (PRESS)', "If x is greater than 2, y = x + 1. If it is between 0 and 2, y = x². If it is negative, y = x³ − 5."]],
  res: "x = 3 gives 4, x = 2 gives 4, x = 0 gives 0, and x = -2 gives -13."
},
e6d: {
  what: "Converts a student's mark into a grade with the {{Select Case}} statement.",
  ins: [['Text1 (MARK)', "Enter the mark from 0 to 100. Default value: 85"], ['Text2 (EVALUATION)', "Locked. The grade appears here."]],
  btns: [['Command1 (EVALUATE)', "Checks the mark and writes the grade."]],
  res: '95 Excellent. 85 Very Good. 75 Good. 65 Medium. 55 Fair. 45 Failed.'
},
e6e: {
  what: "Chooses one of four equations according to your number.",
  ins: [['Text1 (Input x)', "The value of x. Default value: 2"], ['Text2 (Choose 1 to 4)', "The equation number from 1 to 4. Default value: 1"], ['Text3 (Result y)', "Locked. The result appears here."]],
  btns: [['Command1 (Solution)', "Applies the chosen equation to x."]],
  res: "With x = 2: choice 1 gives 8.02, choice 2 gives 0.2557, choice 3 gives -1.4919, and choice 4 gives 16.83. Choice 5 or more gives Wrong Choice."
},
e6f: {
  what: "Homework: checking the user name and password. The correct pair is admin and 1234.",
  ins: [['Text1 (Username)', "User name"], ['Text2 (Password)', "Password"]],
  btns: [['Command1 (Check)', "Checks both together, then writes the result in Label3."]],
  res: "admin and 1234: Welcome. admin and 999: Wrong password. xyz and 1234: Wrong user. xyz and 999: Wrong Information."
},
e6g: {
  what: "Homework: finds the largest and smallest of three numbers.",
  ins: [['Text1 (a)', "The first number. Default value: 4"], ['Text2 (b)', "The second number. Default value: 9"], ['Text3 (c)', "The third number. Default value: 6"]],
  btns: [['Command1 (Find Max and Min)', "Assumes a is both the largest and the smallest, then compares it with b and c."]],
  res: "With 4, 9 and 6: Max = 9 and Min = 4."
},
e6h: {
  what: "Homework: checks whether a number is divisible by 4, by 5, or by both.",
  ins: [['Text1', "Enter a number. Default value: 20"]],
  btns: [['Command1 (Check)', "Uses Mod. If the remainder is zero, the number is divisible."]],
  res: "20 is divisible by 4 and 5. 8 by 4 only. 15 by 5 only. 7 by neither."
},
e6i: {
  what: "Homework: a three-branch function using {{Select Case}}.",
  ins: [['Text1 (x)', "The value of x. Default value: 2"], ['Text2 (y)', "Locked. The result appears here."]],
  btns: [['Command1 (Solve)', "x from 1 to 4: y = (x³+5)/(x²−2). x from 5 to 10: y = 7 × x⁻². x greater than 11: y = 60 − x. Otherwise: Undefined."]],
  res: "x = 2 gives 6.5, x = 6 gives 0.1944, x = 15 gives 45, and x = 11 gives Undefined because it falls outside every case."
}
};
for (const k in GUIDE) if (EX[k]) EX[k].guide = GUIDE[k];

GUIDE.t_label = {
  what: "An application of the {{Label}} control. The large Label at the top is the target; the buttons change its properties one at a time.",
  ins: [],
  btns: [['Command1 (Caption)', "Changes the text to Visual Basic 6."], ['Command2 (ForeColor)', "Makes the text colour blue."], ['Command3 (BackColor)', "Makes the background yellow."], ['Command4 (FontSize)', "Enlarges the font to 24."], ['Command5 (FontBold)', "Makes the font bold."], ['Command6 (BorderStyle)', "Removes the border."], ['Command7 (Alignment)', "Centres the text."], ['Command8 (Reset)', "Returns every property to its original state."]],
  res: "Press the buttons in order. Each button changes one property. Then press Reset to start again.",
  tryit: "A Label does not accept typing from the user. It is for display only."
};
GUIDE.t_text = {
  what: "An application of the {{TextBox}} control: the {{Text}}, {{MaxLength}}, {{MultiLine}}, {{Locked}} and {{Enabled}} properties, and the {{SetFocus}} method.",
  ins: [['Text1 (Name)', "A short name. Maximum length 10 characters (MaxLength = 10)."], ['Text2 (Notes)', "Notes. Accepts several lines (MultiLine = True)."]],
  btns: [['Command1 (Copy to Label)', "Copies the text of Text1 to Label3."], ['Command2 (SetFocus Text2)', "Moves the cursor to Text2."], ['Command3 (Locked on/off)', "Locks or unlocks Text1. A locked box can be read but not typed in."], ['Command4 (Clear)', "Clears both boxes and returns the cursor to Text1."], ['Command5 (Disable)', "Disables Text1, so it turns grey and does not respond."], ['Command6 (Enable)', "Enables Text1 again."]],
  res: "Type Ali in Text1, then press Copy to Label: the name appears in Label3. Try typing more than 10 characters.",
  tryit: "The difference: Locked prevents typing but allows copying. Enabled = False disables the box completely."
};
GUIDE.t_btn = {
  what: "An application of the {{CommandButton}} control. The Target button at the top is the target; the other buttons control it.",
  ins: [],
  btns: [['Target', "When pressed, Label1 shows Target was clicked."], ['Command1 (Disable Target)', "Disables Target (Enabled = False), so it does not respond."], ['Command2 (Enable Target)', "Enables it again."], ['Command4 (Rename)', "Changes the text of Target to Renamed."], ['Command5 (Hide/Show)', "Hides or shows Target (Visible)."], ['Command6 (Move right)', "Moves Target to the right (Left)."], ['Command7 (OK)', "This is the Default button. It also runs when you press Enter."]],
  res: "Disable Target, then press it: nothing happens. Enable it, then press it: the message appears.",
  tryit: "Press Enter on the keyboard to see the Default button work."
};
GUIDE.t_img = {
  what: "An application of the {{Image}} control. The picture here is an emoji instead of a file, but the idea is the same: {{Picture}} and {{LoadPicture}}.",
  ins: [],
  btns: [['Command1 (Dog)', "Changes the picture to a dog. In real VB: LoadPicture(\"C:\\dog.jpg\")."], ['Command2 (Cat)', "Changes it to a cat."], ['Command3 (Hide/Show)', "Hides or shows the picture."], ['Command4 (Bigger)', "Enlarges the picture (Width and Height)."], ['Command5 (Move right)', "Moves it to the right (Left)."], ['Command6 (Reset)', "Restores the size, position and visibility."], ['Image1_Click', "When you click the picture, Label1 shows: You clicked the image."]],
  res: "Press Dog and the picture changes. Press Bigger several times and it grows. Click the picture itself.",
  tryit: "The picture receives events such as Click, just like a button."
};
GUIDE.t_form = {
  what: "An application of the {{Form}} itself. The form is an object with properties and events, like any control.",
  ins: [['Text1 (Title)', "Type a new title for the window. Default value: My Form"]],
  btns: [['Form_Load', "Runs when the form opens. It sets the title to Form Demo."], ['Command1 (Set Caption)', "Sets the window title to what you typed in Text1."], ["Command2, Command3 and Command4", "Change the form's background colour to red, green and blue."], ['Command5 (Print)', "Prints Hello from the form on the form."], ['Form_Click', "Click any empty spot on the form and its title changes."]],
  res: "Type a title, then press Set Caption. Try the three colours. Click the background."
};
GUIDE.all1 = {
  what: "The complete project: a system that computes a student's average and gives a grade. It combines every control: {{Form}}, {{Label}}, {{TextBox}}, {{CommandButton}} and {{Image}}, with {{InputBox}}, {{MsgBox}}, variables, {{If}} and {{Select Case}}.",
  ins: [['Text1 (Name)', "The student's name. Required. Example: Sara"], ['Text2 (Math)', "The maths mark from 0 to 100. Example: 90"], ['Text3 (English)', "The English mark. Example: 95"], ['Text4 (Computer)', "The computer mark. Example: 100"], ['Text5 (Average)', "Locked. The average appears here."], ['Text6 (Grade)', "Locked. The grade appears here."]],
  btns: [['Command1 (Calculate)', "First it checks: if the name is empty, it shows a MsgBox and returns the cursor to Text1. If a mark is outside 0 to 100, it shows an error message. Then it computes the average, writes the grade with Select Case, and changes the picture to 😀 for a pass or 😢 for a fail."], ['Command2 (Clear)', "Clears all the fields and restores the first picture."], ['Command3 (Exit)', "Asks through MsgBox whether you want to exit. The Esc key also runs it."], ['Command4 (Pass mark)', "Opens an InputBox to change the pass mark. The original value is 50."], ['Image1_Click', "Click the picture and a message shows how many students' results have been computed."], ["Text1 to Text4 (GotFocus)", "When you enter each field, Label9 at the bottom says what to enter."]],
  res: "Sara, 90, 95 and 100 give an average of 95.0, the grade Excellent and the picture 😀. But 30, 40 and 20 give 30.0, Failed and 😢.",
  tryit: "Press Pass mark and type 80. Then compute a student whose average is 75: the student now fails, because the pass mark is 80."
};
for (const k of ['t_label', 't_text', 't_btn', 't_img', 't_form', 'all1']) if (EX[k]) EX[k].guide = GUIDE[k];

Object.assign(GUIDE, {
cmd_dim: { what: "Shows the {{Dim}} statement: we declare one text variable and two number variables, then combine them in a sentence.", ins: [['Text1 (Name)', "Type a name. Example: Ali"], ['Text2 (Age)', "Type an age. Example: 20"]], btns: [['Command1 (Show)', "Stores the name in n and the age in age, computes nextYear = age + 1, then shows them in Label3."]], res: "Ali and 20 give: Ali is 20 now, and 21 next year.", tryit: "The Long type holds large numbers. Try changing age to String and notice the difference." },
cmd_msgbox: { what: "Shows the {{MsgBox}} statement with three ready messages, and a question message that gives you an answer.", ins: [], btns: [['Command1 (Info)', "Information message: number 64."], ['Command2 (Warning)', "Warning message: number 48."], ['Command3 (Error)', "Error message: number 16."], ['Command4 (Delete file?)', "Asks with Yes and No buttons (4 + 32). If you choose Yes, File deleted appears. If you choose No, Cancelled appears."]], res: "Try the four buttons. The numbers set the icon and the buttons." },
cmd_inputbox: { what: "Shows the {{InputBox}} statement: a box that asks the user to type a value.", ins: [["The name box", "Type your name, or leave it empty to see the alternative message. Default value: Guest"], ["The two number boxes", "Type a number in each box. Example: 7, then 5"]], btns: [['Command1 (Ask my name)', "Asks for the name. If you type Ali, Hello Ali appears. If you leave it empty, No name entered appears."], ['Command2 (Add two numbers)', "Asks for two numbers and shows 7 + 5 = 12."]], res: "The result appears in the small boxes under the buttons." },
cmd_select: { what: "Shows the {{Select Case}} statement: it chooses one case according to the variable's value.", ins: [['Text1 (Day number)', "A number from 1 to 7. Default value: 3"]], btns: [['Command1 (Show day)', "Reads the number and writes the day's name. 1 is Saturday and 7 is Friday. Any other number falls into Case Else."]], res: "3 gives Monday, 7 gives Friday, and 9 gives Enter a number from 1 to 7." },
cmd_if: { what: "Shows the {{If}} statement with {{ElseIf}} and {{Else}}: it checks conditions in order.", ins: [['Text1 (Age)', "Type the age. Default value: 25"]], btns: [['Command1 (Check)', "Less than 0: Invalid age. Less than 13: Child. Less than 18: Teenager. Otherwise: Adult."]], res: "25 gives Adult, 15 gives Teenager, 8 gives Child, and -3 gives Invalid age." },
cmd_click: { what: "Shows the {{Click}} event: the code that runs when a control is clicked.", ins: [], btns: [['Command1 (Click me)', "Each click increases the variable clicks and shows it in Label1."], ['Command2 (Reset)', "Resets the counter to zero and the colour to black."], ['Label2', "Clicking this Label makes Label1 red. So a Label also has a Click event."]], res: "Press Click me three times and Clicks: 3 appears. Then click Label2 and the colour turns red." }
});
for (const k of ['cmd_dim','cmd_msgbox','cmd_inputbox','cmd_select','cmd_if','cmd_click']) if (EX[k]) EX[k].guide = GUIDE[k];

Object.assign(GUIDE.cmd_dim, {
  lines: [['Dim n As String', "We reserve a place in memory called n that holds text."], ['Dim age As Integer', "We reserve a place called age that holds a whole number."], ['Dim nextYear As Integer', "A third place to store next year's age."], ['n = Text1.Text', "We copy what the user typed in Text1 into n."], ['age = Val(Text2.Text)', "Val converts the text into a number, then we store it in age."], ['nextYear = age + 1', "We compute the age one year from now."], ['Label3.Caption = n & ...', "The & sign joins text and numbers into one sentence and displays it."]],
  learn: "That a variable is a box with a name and a type, and that Dim declares it before use. And that Val is needed before any arithmetic on what the user types." });
Object.assign(GUIDE.cmd_msgbox, {
  lines: [['MsgBox "Saved successfully", 64, "Info"', "The first is the message text. The second, 64, means an information icon. The third is the window title."], ['MsgBox "Battery is low", 48, "Warning"', "The number 48 means an exclamation mark (a warning)."], ['MsgBox "File not found", 16, "Error"', "The number 16 means an error icon."], ['If MsgBox(...4 + 32...) = vbYes Then', "Here MsgBox is a function that returns the user's answer. 4 means the Yes and No buttons, and 32 a question mark. We compare the answer with vbYes."], ['Label1.Caption = "File deleted"', "Runs if Yes was pressed."], ['Else ... "Cancelled"', "Runs if No was pressed."]],
  learn: "That MsgBox either just shows information, or asks the user and returns the answer for us to decide on. And that the numbers add up: button style + icon." });
Object.assign(GUIDE.cmd_inputbox, {
  lines: [['Dim n As String', "A text variable to store the name."], ['n = InputBox("What is your name?", "Name", "Guest")', "Opens an input box. The first argument is the question, the second the title, and the third a default value. What you type is stored in n."], ['If n = "" Then', "If Cancel is pressed or the box is left empty, n is an empty string."], ['Dim a As Single, b As Single', "Two decimal variables to store the two numbers."], ['a = Val(InputBox("First number", "Add"))', "InputBox always returns text. We convert it to a number with Val."], ['Label2.Caption = a & " + " & b & " = " & (a + b)', "We show the operation and the result. The brackets add the two numbers first."]],
  learn: "That a program can ask the user while it runs, that InputBox returns text, and that you must check for an empty answer." });
Object.assign(GUIDE.cmd_select, {
  lines: [['Dim d As Integer', "A variable for the day number."], ['d = Val(Text1.Text)', "We read the number from the box and convert it to a number."], ['Select Case d', "We start choosing according to the value of d."], ['Case 1', "If d equals 1 we run the next line and skip the remaining cases."], ['Case 2 … Case 7', "The same idea for the other days."], ['Case Else', "If no case matches (such as 9 or 0), this part runs."], ['End Select', "The end of the statement."]],
  learn: "That Select Case is clearer than writing many Ifs when we compare one variable with several values. And that Case Else catches wrong values." });
Object.assign(GUIDE.cmd_if, {
  lines: [['Dim age As Integer', "A variable for the age."], ['age = Val(Text1.Text)', "We read the age from the box."], ['If age < 0 Then', "The first condition: a negative age makes no sense, so we show Invalid age."], ['ElseIf age < 13 Then', "Checked only if the first condition fails: under 13 means Child."], ['ElseIf age < 18 Then', "Then under 18 means Teenager."], ['Else', "Everything left (18 and over) is Adult."], ['End If', "The end of the statement."]],
  learn: "That conditions are checked in order from the top, and only the first condition that is true runs. So order matters." });
Object.assign(GUIDE.cmd_click, {
  lines: [['Dim clicks As Integer', "Outside the procedures. It keeps its value between clicks because it is form-level."], ['Private Sub Command1_Click()', "The procedure that runs every time we press Command1."], ['clicks = clicks + 1', "We add 1 to the counter."], ['Label1.Caption = "Clicks: " & clicks', "We show the new value."], ['Private Sub Command2_Click()', "Runs when Reset is pressed and sets the counter back to zero."], ['Private Sub Label2_Click()', "The procedure name = control name + _ + event name. So a Label also has a Click event."]],
  learn: "That events drive the program: no procedure runs until something happens, such as a click. And that a procedure's name is built from the control's name and the event's name." });
