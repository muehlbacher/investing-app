# financial_data/utils.py

import pandas as pd
from .models.financialdata_model import FinancialData
from .models.company_model import Company
from .models.financialdata_model import FinancialData
from .models.metrictooltip_model import MetricTooltip
from .errors import CompanyDoesNotExistError, MetricDoesNotExistError


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
            "incomeBeforeTaxRatio",
            "incomeTaxExpense",
            "netIncome",
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
                    "value": row["Value"],
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


def prepare_wb_table_data(ticker):
    try:
        # Define required metrics
        metrics = [
            "sgaRatio",
            "randdRatio",
            "deprecationRatio",
            "interestExpenseRatio",
            "netEarningsRatio",
            "GrossProfitMargin",
        ]

        # Fetch financial data for the given company and metrics
        results = (
            FinancialData.objects.select_related("MetricID", "TimePeriodID")
            .filter(CompanyID__Ticker=ticker, MetricID__MetricName__in=metrics)
            .values("MetricID__MetricName", "TimePeriodID__Year", "Value", "Valuation")
        )
        print("WARREN BUFFET TABLE: ---------")
        print(results)
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
                    "value": row["Value"],
                    "class": f"valuation-{row['Valuation']}",
                }
                for _, row in group.iterrows()
            }
            for metric, group in df.groupby("MetricID__MetricName")
        }

        unique_years = sorted(df["TimePeriodID__Year"].unique(), reverse=True)
        print(unique_years)
        return metric_data, unique_years

    except Company.DoesNotExist:
        return f"Company with ticker '{ticker}' does not exist.", []
    except Exception as e:
        return f"An error occurred: {str(e)}", []


def fetch_metric_tooltip(metrics=None) -> dict:
    """
    fetches tooltips from database
    if metrics is none fetches all tooltips

    """
    # Query to get all tooltips along with the corresponding MetricName
    tooltips = MetricTooltip.objects.select_related("Metric").all()

    # Initialize an empty dictionary to store the results
    tooltip_dict = {}

    # Loop through and add the results to the dictionary
    for tooltip in tooltips:
        tooltip_dict[tooltip.Metric.MetricName] = tooltip.Tooltip
    print("TOOLTIP")
    print(tooltip_dict)

    return tooltip_dict
