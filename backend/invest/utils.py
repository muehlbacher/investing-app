# financial_data/utils.py

import pandas as pd
from .models.financialdata_model import FinancialData
from .models.company_model import Company
from .errors import CompanyDoesNotExistError


def prepare_table_data_selected_metrics(ticker, metrics=None):
    if not metrics:
        metrics = [
            "revenue",
            "costOfRevenue",
            "grossProfit",
            "operatingExpenses",
            "operatingIncome",
            "sellingGeneralAndAdministrativeExpenses",
            "researchAndDevelopmentExpenses",
            "depreciationAndAmortization",
            "interestExpense",
            "otherExpenses",
            "incomeBeforeTax",
        ]

    try:
        results = (
            FinancialData.objects.select_related("MetricID", "TimePeriodID")
            .filter(CompanyID__Ticker=ticker, MetricID__MetricName__in=metrics)
            .values("MetricID__MetricName", "TimePeriodID__Year", "Value", "Valuation")
        )
        if not results:
            raise Company.DoesNotExist()
        # Convert query results into a DataFrame
        df = pd.DataFrame.from_records(results)
        if df.empty:
            return {}, []  # Return empty data if no records found

        # Sort DataFrame by Year (Descending) and then by Metric
        df.sort_values(
            by=["TimePeriodID__Year", "MetricID__MetricName"],
            ascending=[False, True],
            inplace=True,
        )

        # Transform data into a nested dictionary format
        metric_data = {
            metric: {
                str(row["TimePeriodID__Year"]): {
                    "value": f"{row['Value']:,.0f}",
                    "class": f"valuation-{row['Valuation']}",
                    "tooltip": "This is the tooltip message from the financial service!",
                }
                for _, row in group.iterrows()
            }
            for metric, group in df.groupby("MetricID__MetricName")
        }

        unique_years = sorted(df["TimePeriodID__Year"].unique(), reverse=True)
        return metric_data, unique_years

    except Company.DoesNotExist as e:
        raise CompanyDoesNotExistError(
            f"Company with ticker '{ticker}' does not exist."
        ) from e
    except Exception as e:
        return f"An error occurred: {str(e)}", []
