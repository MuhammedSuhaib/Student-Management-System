#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
//npm install inquirer@9.2.10
//npm install @types/inquirer@9.0.3 -D
class Student {
    id;
    name;
    courseEnrolled;
    feesAmount;
    feesPaid;
    constructor(id, name, courseEnrolled, feesAmount) {
        this.id = id;
        this.name = name;
        this.courseEnrolled = courseEnrolled;
        this.feesAmount = feesAmount;
        this.feesPaid = 0; // Initial fees paid
    }
    payFee(amount) {
        if (amount > 0 && amount <= this.getBalance()) {
            this.feesPaid += amount;
            console.log(`Paid ${amount}. Remaining balance: ${this.getBalance()}`);
        }
        else {
            console.log(`Invalid payment amount. Current balance: ${this.getBalance()}`);
        }
    }
    getBalance() {
        return this.feesAmount - this.feesPaid;
    }
}
let baseId = 10000;
let studentList = [];
(async () => {
    while (true) {
        let takeData = await inquirer.prompt({
            name: "option",
            type: "list",
            message: "select an  option:",
            choices: ["enroll", "show status", "pay fees", "exit"],
        });
        if (takeData.option === "enroll") {
            let stdName = await inquirer.prompt({
                name: "name",
                type: "input",
                message: "Enter student name:",
            });
            let stdCourse = await inquirer.prompt({
                name: "course",
                type: "checkbox",
                message: "Select course:",
                choices: ["HTML", "CSS", "JavaScript", "TypeScript", "React"],
            });
            let feesAmount = stdCourse.course.length * 1000; // Fees based on the number of courses    
            studentList.push(new Student(baseId++, stdName.name, stdCourse.course, feesAmount));
            console.log(chalk.bold.greenBright("Student enrolled successfully!"));
        }
        else if (takeData.option === "show status") {
            console.log(chalk.bold.magenta("Current Students List:"));
            studentList.forEach(student => {
                console.log(chalk.bold.blue(`Roll No:`), ` ${student.id}`, chalk.bold.blue(`Name: `), `${student.name}`, chalk.bold.blue(` Courses :`), ` ${student.courseEnrolled.join(", ")}  `, chalk.bold.blue(`Total Fees`), `: ${student.feesAmount}`, chalk.bold.green(`Fees Paid:`), ` ${student.feesPaid}`, chalk.bold.green(` Balance:`), ` ${student.getBalance()}`);
            });
        }
        else if (takeData.option === "pay fees") {
            let rollNoInput = await inquirer.prompt({
                name: "rollNo",
                type: "number",
                message: "Enter roll number:",
            });
            let student = studentList.find(s => s.id === rollNoInput.rollNo);
            if (student) {
                let amountInput = await inquirer.prompt({
                    name: "amount",
                    type: "number",
                    message: `Current balance: ${student.getBalance()}. Enter amount to pay:`,
                });
                student.payFee(amountInput.amount);
            }
            else {
                console.log(chalk.bold.redBright("Student not found!"));
            }
        }
        else if (takeData.option === "exit") {
            break;
        }
        else {
            console.log(chalk.bold.redBright("invalid option"));
        }
    }
})();
