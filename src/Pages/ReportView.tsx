import React from 'react';
import {TextInput, Select, MultiSelect, Button} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm} from '@mantine/form';
import {Grid, Stack, Box} from "@mui/material";
import axios from "axios";


export default function ReportView() {

    const date = (new Date(), 'yyyy-MM-dd hh:mm:ss', 'en_US')

    const departments = [
        {value: 'Ambulatory Care', label: 'Ambulatory Care'},
        {value: 'Behavioral/Mental Health', label: 'Behavioral/Mental Health'},
        {value: 'Dental', label: 'Dental'},
        {value: 'Emergency Care', label: 'Emergency Care'},
        {value: 'Information Management', label: 'Information Management'},
        {value: 'Laboratory', label: 'Laboratory'},
        {value: 'Logistics', label: 'Logistics'},
        {value: 'Medicine', label: 'Medicine'},
        {value: 'Nursing', label: 'Nursing'},
        {value: 'OB/GYN', label: 'OB/GYN'},
        {value: 'Pediatrics', label: 'Pediatrics'},
        {value: 'Pharmacy', label: 'Pharmacy'},
        {value: 'Radiology', label: 'Radiology'},
        {value: 'Surgery', label: 'Surgery'},
        {value: 'Other', label: 'Other'}
    ];

    const individualsInvolved = [
        {value: 'Patient', label: 'Patient'},
        {value: 'Family Member - Adult', label: 'Family Member - Adult'},
        {value: 'Family Member - Child', label: 'Family Member - Child'},
        {value: 'Staff Member', label: 'Staff Member'},
        {value: 'Visitor', label: 'Visitor'},
        {value: 'Volunteer', label: 'Volunteer'},
        {value: 'Other', label: 'Other'}
    ];

    const eventsType = [
        {value: 'Adverse Drug Reaction', label: 'Adverse Drug Reaction'},
        {value: 'AMA/ Left without being seen', label: 'AMA/ Left without being seen'},
        {value: 'Assault', label: 'Assault'},
        {value: 'Blood Products Related', label: 'Blood Products Related'},
        {value: 'Delay in Diagnosis / Treatment / Transfer', label: 'Delay in Diagnosis / Treatment / Transfer'},
        {value: 'Equipment/Supply Problem', label: 'Equipment/Supply Problem'},
        {value: 'Exposure to Blood / Bodily Fluids', label: 'Exposure to Blood / Bodily Fluids'},
        {value: 'Facility /  Physical Plant Problem', label: 'Facility /  Physical Plant Problem'},
        {value: 'Fall', label: 'Fall'},
        {value: 'Infant Abduction', label: 'Infant Abduction'},
        {value: 'Infant Discharged to Wrong Family', label: 'Infant Discharged to Wrong Family'},
        {value: 'Laboratory Related', label: 'Laboratory Related'},
        {value: 'Medication Related', label: 'Medication Related'},
        {value: 'Needle Stick / Sharp Injury', label: 'Needle Stick / Sharp Injury'},
        {value: 'Obstetrics Related', label: 'Obstetrics Related'},
        {value: 'Operative / Invasive Procedure Related', label: 'Operative / Invasive Procedure Related'},
        {value: 'Property Damaged / Destroyed', label: 'Property Damaged / Destroyed'},
        {value: 'Property Lost / Stolen', label: 'Property Lost / Stolen'},
        {value: 'Radiology Related', label: 'Radiology Related'},
        {value: 'Rape', label: 'Rape'},
        {value: 'Restrained Patient Injury', label: 'Restrained Patient Injury'},
        {value: 'Suicide in a 24 Hour Facility', label: 'Suicide in a 24 Hour Facility'},
        {value: 'Other', label: 'Other'}
    ];


    const report = useForm({
        initialValues: {
            dateOfEvent: "",
            timeOfEvent: "",
            locationOfEvent: "",
            eventType: false,
            harm: false,
            individuals: [],
            typeOfEvent: [],
            effectOfIncident: false,
            witness1: "",
            witnessNumbers1: "",
            witness2: "",
            witnessNumbers2: "",
            witness3: "",
            witnessNumbers3: "",
            departmentsInvolved: [],
            description: "",
            actions: "",
            patientName: "",
            patientPhone: "",
            patientSSN: "",
            patientAddress: "",
        },
        validateInputOnChange: true,

        validate: {
            //dateOfEvent: (value) => (/^(2\d{3}-(0[1-9]|1[0-9])-(0[1-9]|[12]\d|3[01]))/.test(value.toLocaleString()) ? null : "Invalid date"),
            //timeOfEvent: (value) =>  (/^(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/.test(value) ? null : "Invalid Time" ),
            locationOfEvent: (value) => (value.length < 8 ? 'Location input is too short' : null),
            description:(value) => (value.length < 15 ? 'Enter a more detailed description' : null),
            actions:(value) => (value.length < 15 ? 'Enter more detailed action' : null),
            patientName:(value) => (value.length < 3 ? 'Enter full name' : null),
            witness1: (value) => (value.length < 3 ? 'Enter full name' : null),
            witness2: (value) => (value.length < 3 ? 'Enter full name' : null),
            witness3: (value) => (value.length < 3 ? 'Enter full name' : null),
            witnessNumbers1: (value) => (/^1?-?\(?[0-9]{3}[\-\)][0-9]{3}-[0-9]{4}$/.test(value) ? null : "Invalid Number: use ###-###-####" ),
            witnessNumbers2: (value) => (/^1?-?\(?[0-9]{3}[\-\)][0-9]{3}-[0-9]{4}$/.test(value) ? null : "Invalid Number: use ###-###-####" ),
            witnessNumbers3: (value) => (/^1?-?\(?[0-9]{3}[\-\)][0-9]{3}-[0-9]{4}$/.test(value) ? null : "Invalid Number: use ###-###-####" ),
            patientPhone:(value) => (/^1?-?\(?[0-9]{3}[\-\)][0-9]{3}-[0-9]{4}$/.test(value) ? null : "Invalid Number: use ###-###-####" ),
            patientSSN:(value) => (/^[0-9]{3}-[0-9]{2}-[0-9]{4}$/.test(value) ? null : "Invalid SSN: use ###-##-####\"" ),
            patientAddress: (value) => (value.length < 10 ? 'Enter full Address' : null),
        }

    });

    type FormValues = typeof report.values;

    function convertDate(inputFormat: string) {
        function pad(s: number) { return (s < 10) ? '0' + s : s; }
        let d = new Date(inputFormat)
        return [pad(d.getFullYear()), pad(d.getMonth()+1), pad(d.getDate()+1)].join('-')
    }

    function convertTime(inputFormat: string) {
        function pad(s: number) { return (s < 6) ? '0' + s : s; }
        let t = new Date(inputFormat)
        console.log(t)
        return [pad(t.getHours()), pad(t.getMinutes())].join(':')
    }


  async function handleSubmit (values: FormValues) {
        report.isValid();
        report.validate();
        console.log(report)
        console.log("Validated")
        let date = convertDate(values.dateOfEvent)
        let time = convertTime(values.timeOfEvent)
        let dateTime = date + " " + time
        console.log(time)
        console.log(date)
        //post request

        let witnessNames = [report.values.witness1, report.values.witness2, report.values.witness3 ]
        let witnessNumbers = [report.values.witnessNumbers1, report.values.witnessNumbers2, report.values.witnessNumbers3]
        console.log(dateTime)

        await axios.post("http://localhost:8080/Report", {
            "dateTime": dateTime,
            "location": report.values.locationOfEvent,
            "eventType": report.values.eventType,
            "harm": report.values.harm,
            "individualsInvolved": report.values.individuals,
            "eventCategory": report.values.typeOfEvent,
            "incidentEffect": report.values.effectOfIncident,
            "witnessName": witnessNames,
            "witnessTelephone": witnessNumbers,
            "departmentsInvolved": report.values.departmentsInvolved,
            "description": report.values.description,
            "action": report.values.actions,
            "patientName": report.values.patientName,
            "patientPhone": report.values.patientPhone,
            "patientSSN": report.values.patientSSN,
            "patientAddress": report.values.patientAddress
        }).then((response) => {
            console.log(response)

       } ).catch((error) => {
           console.log(error)
       })

    }


    return (
        <Box className="App">
            <form onSubmit={report.onSubmit(handleSubmit)}>
            <h2>Incident Report Form</h2>
            <Stack>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <DatePicker
                                label={"Date of Event"}
                                inputFormat={"YYYY-MM-DD"}
                                withAsterisk
                                required
                                defaultValue={new Date()}
                                {...report.getInputProps(('dateOfEvent'))}
                             />
                        </Grid>
                        <Grid item xs={6}>
                        <TimeInput
                            withAsterisk
                            required
                            label={"Time of Event"}
                            defaultValue={new Date()}
                            {...report.getInputProps(('timeOfEvent'))}
                        />
                        </Grid>
                    </Grid>
            <Box>
                <TextInput
                    withAsterisk
                    required
                    label='Location of event'
                    onChange={(e ) => report.setFieldValue('locationOfEvent', e.target.value)}
                    //classNames={{ input: classes.invalid }}
                >
                </TextInput>
            </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Select
                            withAsterisk
                            required
                            label="Incident Type"
                            data={[
                                {value: true, label: "Actual Event/Incident"},
                                {value: false, label: "Near Miss/CloseCall"}
                            ]}
                            {...report.getInputProps('eventType')}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Select
                            withAsterisk
                            required
                            label="Harm"
                            data={[
                                {value: true, label: "Harm"},
                                {value: false, label: "Potential Harm"}
                            ]}
                            {...report.getInputProps('harm')}
                        />
                    </Grid>
                </Grid>
                <Box>
                    <MultiSelect
                        withAsterisk
                        required
                        data={individualsInvolved}
                        placeholder="Individuals"
                        label="Individuals Involved"
                        {...report.getInputProps('individuals')}
                    />
                </Box>
                <Box>
                    <MultiSelect
                        withAsterisk
                        required
                        data={eventsType}
                        placeholder="Select Type of Event"
                        label="Type of Event"
                        {...report.getInputProps('typeOfEvent')}
                    />
                </Box>
                <Box>
                    <Select
                        withAsterisk
                        required
                        label="Effect of Incident"
                        data={[
                            {value: true, label: "Harm sustained"},
                            {value: false, label: "Potential Harm"}
                        ]}
                        {...report.getInputProps('effectOfIncident')}
                    />
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextInput
                            withAsterisk
                            required
                            label='Witness'
                            {...report.getInputProps('witness1')}
                        >
                        </TextInput>
                    </Grid>
                    <Grid item xs={6}>
                        <TextInput
                            withAsterisk
                            required
                            label='Witness Number'
                            {...report.getInputProps('witnessNumbers1')}
                        >
                        </TextInput>
                    </Grid>
                    <Grid item xs={6}>
                        <TextInput
                            label='Witness'
                            {...report.getInputProps('witness2')}
                        >
                        </TextInput>
                    </Grid>
                    <Grid item xs={6}>
                        <TextInput
                            label='Witness Number'
                            {...report.getInputProps('witnessNumbers2')}
                        >
                        </TextInput>
                    </Grid>
                    <Grid item xs={6}>
                        <TextInput
                            label='Witness'
                            {...report.getInputProps('witness3')}
                        >
                        </TextInput>
                    </Grid>
                    <Grid item xs={6}>
                        <TextInput
                            label='Witness Number'
                            {...report.getInputProps('witnessNumbers3')}
                        >
                        </TextInput>
                    </Grid>
                </Grid>
                <Box>
                    <MultiSelect
                        withAsterisk
                        required
                        data={departments}
                        placeholder="Select Departments"
                        label="Departments Involved"
                        {...report.getInputProps('departmentsInvolved')}
                        />
                </Box>
                <Box>
                    <TextInput
                        withAsterisk
                        required
                        label='Description'
                        {...report.getInputProps('description')}
                        //classNames={{ input: classes.invalid }}
                    >
                    </TextInput>
                </Box>
                <Box>
                    <TextInput
                        withAsterisk
                        required
                        label='Actions'
                        {...report.getInputProps('actions')}
                        //classNames={{ input: classes.invalid }}
                    >
                    </TextInput>
                </Box>
                <Box>
                    <TextInput
                        withAsterisk
                        required
                        label='Patient Name'
                        {...report.getInputProps('patientName')}
                        //classNames={{ input: classes.invalid }}
                    >
                    </TextInput>
                </Box>

                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextInput
                                withAsterisk
                                required
                                label='Patient Phone'
                                {...report.getInputProps('patientPhone')}
                                //classNames={{ input: classes.invalid }}
                            >
                            </TextInput>
                        </Grid>
                        <Grid item xs={6}>
                            <TextInput
                                withAsterisk
                                required
                                label='Patient SSN'
                                {...report.getInputProps('patientSSN')}
                                //classNames={{ input: classes.invalid }}
                            >
                            </TextInput>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <TextInput
                        withAsterisk
                        required
                        label='Patient Address'
                        {...report.getInputProps('patientAddress')}
                    >
                    </TextInput>
                </Box>
                <Box>
                    <Button style={{backgroundColor: "Green"}} type={"submit"} >Submit</Button>
                </Box>
            </Stack>
            </form>
        </Box>
    );
}
// const useStyles = createStyles((theme) => ({
//     invalid: {
//         backgroundColor:
//             theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors.red[8], 0.15) : theme.colors.red[0],
//     },
//
//     icon: {
//         color: theme.colors.red[theme.colorScheme === 'dark' ? 7 : 6],
//     },
// }));
//
// const { classes } = useStyles();

