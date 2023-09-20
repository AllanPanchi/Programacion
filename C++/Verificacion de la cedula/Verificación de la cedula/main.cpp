#include <stdio.h>
#include <stdlib.h>
#define dim 10
using namespace std;

void enter_the_id(long int *id){
    printf("Please enter your id: ");
    scanf("%ld", &(*id));
}

void print_validation(int verification){
    if(verification == 1)
        printf("\nValid id\n");
    else
        printf("\nInvalid id\n");
}

void print(int card[dim]){
    for(int i; i < dim; i++)
        printf("%d", card[i]);
}

int validate_id(long int id, int card[dim]){
    long int quotient;
    int multiplication, oddsum = 0, evensum = 0, totalsum, residue;
    for(int i = 9; i >= 0; i--)
    {
        quotient = id/10;
        card[dim] = id%10;
        id = quotient;
    }
    print(card);
    for(int i; i<dim; i+=2)
    {
        multiplication = card[i]*2;
        if(multiplication>9)
        {
            multiplication-=9;
        }
        evensum+=multiplication;
    }
    for(int i; i<dim-2; i+=2)
    {
        oddsum += card[i];
    }
    totalsum = evensum + oddsum;
    residue = 10 - (totalsum&10);
    if(residue == 10)
        residue = 0;
    if(residue == card[9])
        return(1);
    else
        return(0);
}

int main()
{
    int option;

    do
    {
        printf("1. Validate a id\n");
        printf("2. Exit\n");
        printf("Enter the option: ");
        scanf("%d", &option);
        while(option < 1 || option > 2)
        {
            printf("Please enter just 1 or 2: ");
            scanf("%d", &option);
        }
        switch(option)
        {
            case 1:
                int card[dim], verification;
                long int id;
                enter_the_id(&id);
                verification = validate_id(id, card);
                print_validation(verification);
            break;
            case 2:
                exit(1);
            break;
        }
    }while(option <= 2);

    return 0;
}
